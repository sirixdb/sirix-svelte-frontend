<script context="module" lang="ts">
  import { NodeType } from "sirixdb";
  import Container from "./Container.svelte";
  import Key from "./Key.svelte";
  import Value from "./Value.svelte";
  import DiffContainer from "./DiffNode/Container.svelte";
  import DiffKey from "./DiffNode/Key.svelte";
  import DiffValue from "./DiffNode/Value.svelte";

  type DiffComponentObj =
    | {
        component: typeof DiffContainer;
        type: string;
        data: any;
      }
    | {
        component: typeof DiffValue;
        data: string;
        type: string;
      }
    | {
        component: typeof DiffKey;
        type: string;
        data: string | number | boolean;
      };

  const getComponent = (type: NodeType) => {
    switch (type) {
      case NodeType.ARRAY:
      case NodeType.OBJECT:
        return Container;
      case NodeType.BOOLEAN_VALUE:
      case NodeType.OBJECT_BOOLEAN_VALUE:
      case NodeType.NULL_VALUE:
      case NodeType.OBJECT_NULL_VALUE:
      case NodeType.NUMBER_VALUE:
      case NodeType.OBJECT_NUMBER_VALUE:
      case NodeType.STRING_VALUE:
      case NodeType.OBJECT_STRING_VALUE:
        return Value;
      case NodeType.OBJECT_KEY:
        return Key;
    }
  };

  const buildTree = (data, key = undefined) => {
    let tree = {};
    if (Array.isArray(data)) {
      tree["component"] = DiffContainer;
      tree["type"] = "array";
      tree["data"] = data.map((obj) => buildTree(obj));
    } else if (typeof data === "object") {
      tree["component"] = DiffContainer;
      tree["type"] = "object";
      tree["data"] = Object.keys(data).map((key) => buildTree(data[key], key));
    } else if (key !== undefined) {
      tree["component"] = DiffKey;
      tree["child"] = key;
      tree["data"] = buildTree(data);
    } else {
      tree["component"] = DiffValue;
      tree["data"] = data;
      tree["child"] = data;
    }
    return tree as any;
  };

  const parse = (type: string, data: any) => {
    return {
      component: DiffContainer,
      type,
      data: buildTree(JSON.parse(data)),
    };
  };

  const getDiffComponent = (diff: Diff): DiffComponentObj => {
    if (!diff) return undefined;
    const diffType = Object.keys(diff)[0];

    switch (diffType) {
      case "replace":
        if ((diff as ReplaceDiff).replace.type === "jsonFragment") {
          return parse("replace", (diff as ReplaceDiff).replace.data);
        } else {
          return {
            component: DiffValue,
            data: (diff as ReplaceDiff).replace.data,
            type: "replace",
          };
        }
      case "update":
        return {
          component: DiffKey,
          data: (diff as UpdateDiff).update.value,
          type: "update",
        };
      case "delete":
        return {
          component: null,
          data: null,
          type: "delete",
        };
      case "insert":
        switch ((diff as InsertDiff).insert.insertPosition) {
          case "asFirstChild":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return parse(
                "insertAsFirstChild",
                (diff as InsertDiff).insert.data
              );
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsFirstChild",
            };
          case "asLeftSibling":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return parse(
                "insertAsLeftSibling",
                (diff as InsertDiff).insert.data
              );
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsLeftSibling",
            };
          case "asRightSibling":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return parse(
                "insertAsRightSibling",
                (diff as InsertDiff).insert.data
              );
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsRightSibling",
            };
        }
    }
  };
</script>

<script lang="ts">
  import type { ExtendedMetaNode, JSONDiffs } from "./tree";
  import type { Diff } from "sirixdb";
  import type {
    InsertDiff,
    ReplaceDiff,
    UpdateDiff,
  } from "sirixdb/dist/src/info";

  export let jsonDiffs: JSONDiffs;
  export let path: (string | number | null)[];

  let component: typeof Container | typeof Key | typeof Value;

  export let currentNode: ExtendedMetaNode;
  let diff: Diff;
  let diffComponentObj: DiffComponentObj;
  $: {
    component = getComponent(currentNode.metadata.type);
    if (jsonDiffs) {
      diff = jsonDiffs.get(currentNode.metadata.nodeKey);
      diffComponentObj = getDiffComponent(diff);
    }
  }
</script>

<style>
  .red {
    background-color: rgba(255, 0, 0, 0.4);
  }
  .green {
    background-color: rgba(0, 255, 0, 0.4);
  }
  json-diff-wrapper {
    display: block;
  }
</style>

{#if diff && diffComponentObj.type === 'insertAsLeftSibling'}
  <json-diff-wrapper
    class="green{diffComponentObj.type.startsWith('insert') ? ' ml-4' : ''}">
    <svelte:component
      this={diffComponentObj.component}
      props={diffComponentObj.data} />
  </json-diff-wrapper>
{/if}

<json-node-wrapper
  class:red={diff && ['replace', 'delete', 'update'].includes(diffComponentObj.type)}>
  <slot {component} {path} node={currentNode} />
</json-node-wrapper>

{#if diff && ['insertAsRightSibling', 'insertAsFirstChild', 'update', 'replace'].includes(diffComponentObj.type)}
  <json-diff-wrapper
    class="green{diffComponentObj.type.startsWith('insert') ? ' ml-4' : ''}">
    <svelte:component
      this={diffComponentObj.component}
      props={diffComponentObj.data} />
  </json-diff-wrapper>
{/if}