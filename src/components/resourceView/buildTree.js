import { sirix } from "../../sirix";
import { NodeType } from "sirix/src/info";
import Container from "./JsonNode/Container.svelte";
import Key from "./JsonNode/Key.svelte";
import Value from "./JsonNode/Value.svelte";
import DiffNode from "./JsonNode/DiffNode.svelte";

export const createTree = (
  node,
  path,
  index
) => {
  let treeNode = {};
  const nodeType = node.metadata.type;
  treeNode["node"] = node;
  if (nodeType === NodeType.ARRAY || nodeType === NodeType.OBJECT) {
    treeNode["component"] = Container;
    treeNode["path"] =
      path.length === 0 && index === undefined
        ? path
        : typeof path[path.length - 1] === "string"
          ? path.concat(null)
          : path.concat(index);
    if (!Array.isArray(node.value)) {
      treeNode["child"] = [];
    } else {
      treeNode["child"] = node.value.map((obj, index) =>
        createTree(obj, treeNode["path"], index)
      );
    }
  } else if (nodeType === NodeType.OBJECT_KEY) {
    treeNode["component"] = Key;
    treeNode["path"] = path.concat(node.key);
    treeNode["child"] = createTree(node.value, treeNode["path"], undefined);
  } else {
    treeNode["component"] = Value;
    treeNode["path"] =
      typeof path[path.length - 1] === "string"
        ? path.concat(null)
        : path.concat(index);
  }
  return treeNode;
};

export const loadDiffs = (
  revision,
  otherRevision,
  dbName,
  dbType,
  resourceName,
  { nodeId = null, maxLevel = 3 }
) => {
  let first, second;
  if (otherRevision > revision) {
    (first = revision), (second = otherRevision);
  } else {
    (first = otherRevision), (second = revision);
  }
  return sirix.database(dbName, dbType).then(db => {
    return db
      .resource(resourceName)
      .diff(first, second, { nodeId, maxLevel })
      .then(diffObj => {
        return diffObj["diffs"];
      });
  });
};

export const inject = (treeNode, newNode, path, insertKey) => {
  let node = path.reduce((oldNode, key) => {
    if (key === null) {
      // if key is null, then return the `value` node of the current node.
      // this is used with OBJECT_ * _VALUE types,
      // as they don't have a key or index within the value field
      return oldNode.child;
    } else {
      // we are going to assume that if a key is specified,
      // then we are dealing with an an object or array,
      // both of which are encoded as arrays of objects
      if (typeof key === "string") {
        // we assume that if the key is a string,
        // not a number then we are dealing with an object
        return oldNode.child.find(item => item.node.key === key);
      } else {
        // the key is a number and we are dealing with an array
        return oldNode.child[key];
      }
    }
  }, treeNode);
  if (insertKey === null) {
    node.child = newNode;
  } else {
    node.child[insertKey] = newNode;
  }
  return treeNode;
};

export const injectDiffs = (treeNode, diffs, index) => {
  if (diffs.length === 0) {
    return [treeNode, diffs];
  }
  if (Object.keys(treeNode).includes("diffNode")) {

  } else if (Array.isArray(treeNode)) {
    let arr = [];
    for (let [i, obj] of treeNode.entries()) {
      let [node, diffsShifted] = injectDiffs(obj, diffs, i);
      arr = arr.concat(node);
      diffs = diffsShifted;
    }
    treeNode = arr;
  } else {
    let diff = diffs[0];
    let diffType = Object.keys(diff)[0];
    let key =
      diffType === "insert" || "replace"
        ? diff[diffType]["insertPositionNodeKey"]
        : diffType === "update"
          ? diff[diffType]["nodeKey"]
          : diff[diffType];
    if (treeNode.node.metadata.nodeKey === key) {
      let newNode = {
        diffNode: diff,
        component: DiffNode,
      };
      if (diffType === "update" || diffType === "delete" || diffType === "replace") {
        //TODO
        //treeNode = treeNode["child"] = newNode;
      } else {
        treeNode = { ...treeNode, diff: newNode}
      }
      // treeNode = inject(treeNode, newNode, [null], null);
      diffs.shift();
    }
    if (treeNode.child) {
      [treeNode.child, diffs] = injectDiffs(treeNode.child, diffs);
    }
  }
  return [treeNode, diffs];
};