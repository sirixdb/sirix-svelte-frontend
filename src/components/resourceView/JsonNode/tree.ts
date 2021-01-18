import { MetaNode, DiffResponse, Diff, NodeType } from "sirixdb";
import type { DeleteDiff, InsertDiff, ReplaceDiff, UpdateDiff } from "sirixdb/dist/src/info";

export interface ExtendedMetaNode extends MetaNode {
  transition?: boolean;
  expanded?: boolean;
}

type Path = (number | string | null)[];

export const comparePathPrefix = (path: Path, prefix: Path) => {
  if (path.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (path[i] !== prefix[i]) return false;
  }
  return true;
};

const autoExpand = (metaNode: ExtendedMetaNode, keys: number[]) => {
  let paths = [];
  const search = (metaNode: ExtendedMetaNode, path: Path) => {
    if (keys.includes(metaNode.metadata.nodeKey)) {
      paths.push(path);
    }
    const metaValue = metaNode.value;
    if (Array.isArray(metaValue)) {
      if (metaNode.metadata.type === "OBJECT") {
        metaValue.forEach(val => {
          search(val, path.concat(val.key));
        });
      } else {
        metaValue.forEach((val, index) => {
          search(val, path.concat(index));
        });
      }
    } else if (metaNode.key) {
      search(metaValue as MetaNode, path.concat(null));
    }
  }
  search(metaNode, []);
  for (const path of paths) {
    traverse(metaNode, path, (node) => { node.expanded = true; });
  }
};

type traverseCallback = (metaNode: ExtendedMetaNode) => void;

const traverse = (metaNode: ExtendedMetaNode, path: Path, callback: traverseCallback = () => { }) => {
  // path is an array of strings and/or numbers,
  // which make up the sequence of keys to reach the intended node.
  // we can use reduce to iterate through the path, and filter
  // the MetaNode object
  return path.reduce((oldNode: ExtendedMetaNode, key: number | string | null): ExtendedMetaNode => {
    callback(oldNode);
    if (key === null) {
      // if key is null, then return the `value` node of the current node.
      // this is used with OBJECT_ * _VALUE types,
      // as they don't have a key or index within the value field
      const node = oldNode as ExtendedMetaNode;
      return node.value as ExtendedMetaNode;
    } else {
      // we are going to assume that if a key is specified,
      // then we are dealing with an an object or array,
      // both of which are encoded as arrays of objects
      const node = oldNode as ExtendedMetaNode;
      const nodes = node.value as ExtendedMetaNode[];
      if (typeof key === "string") {
        // we assume that if the key is a string,
        // not a number then we are dealing with an object
        return nodes.find(item => item.key === key) as MetaNode;
      } else {
        // the key is a number and we are dealing with an array
        return nodes[key];
      }
    }
  }, metaNode);
}

export type NodeAndType = [ExtendedMetaNode, (number | string | null)[]];

const slice = (
  start: number,
  end: number,
  path: Path,
  node: ExtendedMetaNode,
  ref: { index: number },
  results: NodeAndType[],
  countKeys = false): NodeAndType[] => {
  if (ref.index >= end) return results;
  if (ref.index >= start && ref.index <= end) {
    results.push([node, path]);
  }
  if (!node.expanded && node.metadata.type !== NodeType.OBJECT_KEY) return results;
  if (Array.isArray(node.value)) {
    for (let [index, entry] of node.value.entries()) {
      ref.index += 1;
      slice(start, end, path.concat(entry.key ? entry.key : index), entry, ref, results);
    }
  } else if (node.metadata.type === NodeType.OBJECT_KEY) {
    countKeys && ref.index++;
    slice(start, end, path.concat(null), node.value as ExtendedMetaNode, ref, results);
  }
  return results;
}

const coalesce = (node: ExtendedMetaNode, count: number = 0) => {
  count++;
  if (Array.isArray(node.value)) {
    count = (node.value as ExtendedMetaNode[]).map(item => coalesce(item)).reduce((acc, curr) => acc + curr, count);
  } else if (node.metadata.type === NodeType.OBJECT_KEY) {
    count--;
    count = coalesce(node.value as ExtendedMetaNode, count);
  }
  return count;
}

const totalExpanded = (node: ExtendedMetaNode, count = 0) => {
  count++;
  if (node.expanded && Array.isArray(node.value)) {
    count = (node.value as ExtendedMetaNode[]).map(item => totalExpanded(item)).reduce((acc, curr) => acc + curr, count);
  } else if (node.metadata.type === NodeType.OBJECT_KEY && (node.value as ExtendedMetaNode).expanded) {
    count--;
    count = totalExpanded(node.value as ExtendedMetaNode, count);
  }
  return count;
}

export class JSONResource {
  public totalNodes: number;
  constructor(public metaNode: ExtendedMetaNode) {
    this.totalNodes = coalesce(metaNode);
  }
  totalExpanded = () => {
    return totalExpanded(this.metaNode);
  }
  slice = (start: number, end: number) => {
    return slice(start, end, [], this.metaNode, { index: 0 }, []);
  }
  get = (path: Path) => {
    if (!this.metaNode) return undefined;
    return traverse(this.metaNode, path);
  }
  toggleProperty = (path: Path, property: "transition" | "expanded") => {
    const node = traverse(this.metaNode, path);
    // node was not loaded yet, and we won't be able to access it's metadata. So don't do anything
    if (Object.keys(node).length === 0) return;
    node[property] = !node[property];
  }
  setProperty = (path: Path, property: "transition" | "expanded", value: any) => {
    if (!this.metaNode) return;
    const node = traverse(this.metaNode, path);
    node[property] = value;
  }
  autoExpand = (keys: number[]) => {
    if (!this.metaNode) return;
    autoExpand(this.metaNode, keys);
  }
  inject = (
    path: Path,
    insertNode: MetaNode | MetaNode[],
    insertKey: number | string | null = null
  ): boolean => {
    if (!this.metaNode) return false;
    let node = traverse(this.metaNode, path);
    if (insertKey === null) {
      node.value = insertNode;
      this.totalNodes += (insertNode as MetaNode[]).map(coalesce).reduce((acc, curr) => acc + curr, 0);
      return true;
    } else if (Array.isArray(node.value)) {
      if (typeof insertKey === "string") {
        const nodeValue = node.value as MetaNode[];
        insertKey = nodeValue.findIndex(item => item.key === insertKey);
      }
      node.value[insertKey] = insertNode as MetaNode;
      return true;
    }
    return false;
  }
}

import type { DiffComponentObj } from "./types";
type Callback = (keys: number[]) => void;

export class JSONDiffs {
  database: string;
  resource: string;
  diffsMap: { [key: number]: Diff };
  deferredDiffsMap: {
    [key: number]: {
      originNodeKey: number;
      diff: [DiffComponentObj, string];
    }[];
  };
  oldRevision: number;
  newRevision: number;
  deleteDiffPrefixArray: Path[];
  constructor(diffResponse: DiffResponse, callback: Callback = (keys) => { }) { this.reset(diffResponse, callback) }
  reset = (diffResponse: DiffResponse, callback: Callback = (keys) => { }) => {
    this.diffsMap = [];
    this.database = diffResponse.database;
    this.resource = diffResponse.resource;
    this.oldRevision = diffResponse["old-revision"];
    this.newRevision = diffResponse["new-revision"];
    callback(this.add(diffResponse.diffs));
    this.deferredDiffsMap = [];
    this.deleteDiffPrefixArray = [];
  }
  add = (diffs: Diff[]): number[] => {
    const ret = [];
    let key: number;
    diffs.forEach(diff => {
      switch (Object.keys(diff)[0]) {
        case "replace":
          key = (diff as ReplaceDiff).replace.oldNodeKey;
          ret.push(key);
          this.diffsMap[key] = diff;
          break;
        case "insert":
          key = (diff as InsertDiff).insert.insertPositionNodeKey;
          ret.push(key);
          this.diffsMap[key] = diff;
          break;
        case "delete":
          key = (diff as DeleteDiff).delete.nodeKey;
          ret.push(key);
          this.diffsMap[key] = diff;
          break;
        case "update":
          key = (diff as UpdateDiff).update.nodeKey;
          ret.push(key);
          this.diffsMap[key] = diff;
          break;
      }
    });
    return ret;
  }
  get = (nodeKey: number) => {
    return this.diffsMap[nodeKey];
  }
  addDeleteDiffPrefix = (path: Path) => {
    this.deleteDiffPrefixArray.push(path);
  }
  checkForDeleteDiffPrefix = (path: Path) => {
    for (const prefix of this.deleteDiffPrefixArray) {
      if (comparePathPrefix(path, prefix)) {
        return true;
      }
    }
    return false;
  }
  addDeferredDiff = (originNodeKey: number, nodeKey: number, diff: [DiffComponentObj, string]) => {
    if (this.deferredDiffsMap[nodeKey] === undefined) {
      this.deferredDiffsMap[nodeKey] = [{ diff, originNodeKey }];
    } else {
      this.deferredDiffsMap[nodeKey].push({ diff, originNodeKey });
    }
  }
  getDeferredDiffs = (nodeKey: number) => {
    const ret = this.deferredDiffsMap[nodeKey] || [];
    return ret.map(item => item.diff);
  }
  removeDeferredDiff = (nodeKey: number, diffOriginNodeKey: number) => {
    let arr = this.deferredDiffsMap[nodeKey];
    if (arr === undefined) return;
    this.deferredDiffsMap[nodeKey] = arr.filter(item => {
      item.originNodeKey !== diffOriginNodeKey;
    });
    console.log(this.deferredDiffsMap)
  }
}