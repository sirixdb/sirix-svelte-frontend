import { MetaNode, DiffResponse, Diff, NodeType } from "sirixdb";

export interface ExtendedMetaNode extends MetaNode {
  transition?: boolean;
  expanded?: boolean;
}

const traverse = (metaNode: ExtendedMetaNode, path: (string | number | null)[]) => {
  // path is an array of strings and/or numbers,
  // which make up the sequence of keys to reach the intended node.
  // we can use reduce to iterate through the path, and filter
  // the MetaNode object
  return path.reduce((oldNode: ExtendedMetaNode, key: number | string | null): ExtendedMetaNode => {
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
  path: (number | string | null)[],
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
  } else if ((node.value as ExtendedMetaNode).expanded && node.metadata.type === NodeType.OBJECT_KEY) {
    count--;
    count = totalExpanded(node.value as ExtendedMetaNode, count);
  }
  return count;
}

const greatestNodeKey = (node: ExtendedMetaNode, greatest: number = 0): number => {
  if (node.metadata.nodeKey > greatest) greatest = node.metadata.nodeKey;
  if (Array.isArray(node.value)) {
    for (let item in node.value) {
      greatest = greatestNodeKey(item as unknown as ExtendedMetaNode, greatest);
    }
  } else if (node.metadata.type === NodeType.OBJECT_KEY) {
    greatest = greatestNodeKey(node.value as ExtendedMetaNode, greatest);
  }
  return greatest;
}

export class JSONResource {
  public totalNodes: number;
  constructor(public metaNode: ExtendedMetaNode) {
    this.totalNodes = coalesce(metaNode);
  }
  totalExpanded = () => {
    return totalExpanded(this.metaNode);
  }
  greatestNodeKey = () => {
    return greatestNodeKey(this.metaNode);
  }
  slice = (start: number, end: number) => {
    return slice(start, end, [], this.metaNode, { index: 0 }, []);
  }
  get = (path: Array<number | string | null>) => {
    if (!this.metaNode) return undefined;
    return traverse(this.metaNode, path);
  }
  toggleProperty = (path: (string | number | null)[], property: "transition" | "expanded") => {
    const node = traverse(this.metaNode, path);
    // node was not loaded yet, and we won't be able to access it's metadata. So don't do anything
    if (Object.keys(node).length === 0) return;
    node[property] = !node[property];
  }
  setProperty = (path: (string | number | null)[], property: "transition" | "expanded", value: any) => {
    if (!this.metaNode) return;
    const node = traverse(this.metaNode, path);
    node[property] = value;
  }
  inject = (
    path: (string | number | null)[],
    insertNode: MetaNode | MetaNode[],
    insertKey: number | string | null = null
  ): boolean => {
    if (!this.metaNode) return false;
    let node = traverse(this.metaNode, path);
    if (insertKey === null) {
      node.value = insertNode;
      this.totalNodes += (insertNode as MetaNode[]).map(coalesce).reduce((acc, curr) => acc + curr);
      return true;
    } else if (Array.isArray(node.value)) {
      if (typeof insertKey === "string") {
        const nodeValue = node.value as MetaNode[];
        insertKey = nodeValue.findIndex(item => item.key === insertKey);
      }
      node.value[insertKey] = insertNode as MetaNode;
      return false;
    }
    return false;
  }
}

export class JSONDiffs {
  database: string;
  resource: string;
  diffsMap: { [key: number]: Diff };
  oldRevision: number;
  newRevision: number;
  constructor(diffResponse: DiffResponse) { this.reset(diffResponse) }
  reset = (diffResponse: DiffResponse) => {
    this.diffsMap = [];
    this.database = diffResponse.database;
    this.resource = diffResponse.resource;
    this.oldRevision = diffResponse["old-revision"];
    this.newRevision = diffResponse["new-revision"];
    this.add(diffResponse.diffs);
  }
  add = (diffs: Diff[]) => {
    diffs.forEach(diff => {
      switch (Object.keys(diff)[0]) {
        case "replace":
          this.diffsMap[diff.replace.oldNodeKey] = diff;
          break;
        case "insert":
          this.diffsMap[diff.insert.insertPositionNodeKey] = diff;
          break;
        case "delete":
          this.diffsMap[diff.delete.nodeKey] = diff;
          break;
        case "update":
          this.diffsMap[diff.update.nodeKey] = diff;
          break;
      }
    })
  }
  get = (nodeKey: number) => {
    return this.diffsMap[nodeKey];
  }
}