import type { MetaNode } from "sirixdb";

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

export class JSONResource {
  constructor(private metaNode: ExtendedMetaNode) { }
  reset = (metaNode: MetaNode) => { this.metaNode = metaNode }
  get = (path: Array<number | string | null>) => {
    if (!this.metaNode) return undefined;
    return traverse(this.metaNode, path);
  }
  setProperty = (path: (string | number | null)[], property: "transition" | "expanded", value: any) => {
    if (!this.metaNode) return;
    traverse(this.metaNode, path)[property] = value;
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