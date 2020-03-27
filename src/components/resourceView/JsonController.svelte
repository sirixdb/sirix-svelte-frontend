<script lang="ts">
  import { NodeType } from "sirix/src/info";

  // the preprocessor doesn't allow for importing interfaces, so here are the interfaces
  interface Metadata {
    nodeKey: number;
    hash: number;
    type: NodeType;
    descendantCount?: number; // only for type "OBJECT" and "ARRAY"
    childCount?: number; // only for type "OBJECT" and "ARRAY"
  }
  interface MetaNode {
    metadata: Metadata;
    key?: string; // if metadata.type === "OBJECT_KEY"
    value:
      | Node[] // if metadata.type === "OBJECT" or "ARRAY" alternatively
      | {} // if can be an empty object, if metadata.childCount === 0
      | [] // or an empty array, depending on whether type is "OBJECT" or "ARRAY"
      | Node // if metadata.type === "OBJECT_KEY"
      | string // if metadata.type === "OBJECT_STRING_VALUE" or "STRING_VALUE"
      | number // if metadata.type === "OBJECT_NUMBER_VALUE" or "NUMBER_VALUE"
      | boolean // if metadata.type === "OBJECT_BOOLEAN_VALUE" or "BOOLEAN_VALUE"
      | null; // if metadata.type === "OBJECT_NULL_VALUE" or "NULL_VALUE"
  }

  export let node: MetaNode;

  import Container from "./JsonNode/Container.svelte";
  import Key from "./JsonNode/Key.svelte";
  import Value from "./JsonNode/Value.svelte";

  const createTree = (
    node: MetaNode,
    path: string[],
    index: number | undefined
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

  let treeNode = createTree(node, []);

  import { sirix } from "../../sirix";
  export let dbName, dbType;
  export let resourceName;
  export let revision;

  const loadDeeper = ({ detail }) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .readWithMetadata({
          nodeId: detail.key,
          revision,
          maxLevel: 3
        })
        .then(newNode => {
          const toInsert = newNode.value.map((obj, index) =>
            createTree(obj, detail.path, index)
          );
          treeNode = inject(treeNode, toInsert, detail.path, detail.insertKey);
        });
    });
  };

  const inject = (treeNode, newNode, path, insertKey) => {
    let node = path.reduce((oldNode, key: number | string) => {
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
</script>

<div class="p-1">
  <svelte:component
    this={treeNode.component}
    node={treeNode.node}
    treeNode={treeNode.child}
    path={treeNode.path}
    on:loadDeeper={loadDeeper} />
</div>
