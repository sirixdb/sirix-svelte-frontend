<script context="module" lang="ts">
  import { NodeType } from "sirixdb";
  import Container from "./Container.svelte";
  import Key from "./Key.svelte";
  import Value from "./Value.svelte";
  import DiffContainer from "./DiffNode/Container.svelte";
  import DiffKey from "./DiffNode/Key.svelte";
  import DiffValue from "./DiffNode/Value.svelte";
  import type { DiffComponentObj } from "./types";

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
    } else if (typeof data === "object" && data !== null) {
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
          return {
            ...parse("replace", (diff as ReplaceDiff).replace.data),
            nodekey: undefined,
          };
        } else {
          return {
            component: DiffValue,
            data: (diff as ReplaceDiff).replace.data,
            type: "replace",
            nodekey: undefined,
          };
        }
      case "update":
        return {
          component: DiffKey,
          data: (diff as UpdateDiff).update.value,
          type: "update",
          nodekey: undefined,
        };
      case "delete":
        return {
          component: null,
          data: null,
          type: "delete",
          nodekey: undefined,
        };
      case "insert":
        switch ((diff as InsertDiff).insert.insertPosition) {
          case "asFirstChild":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return {
                ...parse(
                  "insertAsFirstChild",
                  (diff as InsertDiff).insert.data
                ),
                nodekey: (diff as InsertDiff).insert.nodeKey,
              };
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsFirstChild",
              nodekey: (diff as InsertDiff).insert.nodeKey,
            };
          case "asLeftSibling":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return {
                ...parse(
                  "insertAsLeftSibling",
                  (diff as InsertDiff).insert.data
                ),
                nodekey: (diff as InsertDiff).insert.nodeKey,
              };
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsLeftSibling",
              nodekey: (diff as InsertDiff).insert.nodeKey,
            };
          case "asRightSibling":
            if ((diff as InsertDiff).insert.type === "jsonFragment") {
              return {
                ...parse(
                  "insertAsRightSibling",
                  (diff as InsertDiff).insert.data
                ),
                nodekey: (diff as InsertDiff).insert.nodeKey,
              };
            }
            return {
              component: DiffValue,
              data: (diff as InsertDiff).insert.data,
              type: "insertAsRightSibling",
              nodekey: (diff as InsertDiff).insert.nodeKey,
            };
        }
    }
  };
</script>

<script lang="ts">
  import type { ExtendedMetaNode, JSONDiffs } from "./tree";
  import type { Diff } from "sirixdb";
  import type {
    DeleteDiff,
    InsertDiff,
    ReplaceDiff,
    UpdateDiff,
  } from "sirixdb/dist/src/info";
  import { refreshDisplay } from "./store";

  export let jsonDiffs: JSONDiffs;
  export let path: (string | number | null)[];

  let component: typeof Container | typeof Key | typeof Value;

  export let currentNode: ExtendedMetaNode;
  let diff: Diff;
  let diffComponentObj: DiffComponentObj;
  let diffIndentStyle: string;
  // a hacky way of managing consecutive diffs
  let additionalDiffs: [DiffComponentObj, string][] = [];
  // a hacky way of managing diffs that can't be shown immediately, due to subtrees
  let deferredDiffs: [DiffComponentObj, string][] = [];
  $: {
    component = getComponent(currentNode.metadata.type);
    if (jsonDiffs) {
      diff = jsonDiffs.get(currentNode.metadata.nodeKey);
      diffComponentObj = getDiffComponent(diff);
      additionalDiffs = [];
      diffIndentStyle = `margin-left: ${
        path.filter((val) => val !== null).length
      }rem`;
      if (diffComponentObj !== undefined) {
        additionalDiffs = buildDiffArray(diffComponentObj.nodekey);
      }
    }
  }

  const deferDiffs = () => {
    if (Array.isArray(currentNode.value)) {
      var targetNode = (currentNode.value as ExtendedMetaNode[])[
        (currentNode.value as ExtendedMetaNode[]).length - 1
      ];
    } else if (typeof currentNode.value == "object") {
      var targetNode = (currentNode.value as unknown) as ExtendedMetaNode;
    }
    let targetNodeKey: number;
    if (targetNode && targetNode.metadata !== undefined) {
      targetNodeKey = targetNode.metadata.nodeKey;
    }
    if (targetNodeKey !== undefined) {
      jsonDiffs.removeDeferredDiff(targetNodeKey, currentNode.metadata.nodeKey);
      if (currentNode.expanded || currentNode.key) {
        if (
          diffComponentObj &&
          diffComponentObj.type == "insertAsRightSibling"
        ) {
          jsonDiffs.addDeferredDiff(
            currentNode.metadata.nodeKey,
            targetNodeKey,
            [diffComponentObj, diffIndentStyle]
          );
        }
        additionalDiffs.forEach((diff) => {
          jsonDiffs.addDeferredDiff(
            currentNode.metadata.nodeKey,
            targetNodeKey,
            diff
          );
        });
        deferredDiffs.forEach((diff) => {
          jsonDiffs.addDeferredDiff(
            currentNode.metadata.nodeKey,
            targetNodeKey,
            diff
          );
        });
        deferredDiffs = [];
      }
    }
  };

  $: {
    refreshDisplay;
    if (jsonDiffs) {
      deferredDiffs = jsonDiffs.getDeferredDiffs(currentNode.metadata.nodeKey);
      deferDiffs();
    }
  }

  const buildDiffArray = (
    nodekey: number,
    results: [DiffComponentObj, string][] = []
  ): [DiffComponentObj, string][] => {
    const diff = jsonDiffs.get(nodekey);
    if (diff !== undefined) {
      const diffComponentObj = getDiffComponent(diff);
      const diffIndentStyle = `margin-left: ${
        path.filter((val) => val !== null).length
      }rem`;
      results.push([diffComponentObj, diffIndentStyle]);
      buildDiffArray(diffComponentObj.nodekey, results);
    }
    return results;
  };
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
    style={diffIndentStyle}
    class="green{diffComponentObj.type.startsWith('insert') ? ' ml-4' : ''}">
    <svelte:component
      this={diffComponentObj.component}
      props={diffComponentObj.data} />
  </json-diff-wrapper>
{/if}

<json-node-wrapper
  style={path[path.length - 1] !== null ? `margin-left: calc(${path.filter((val) => val !== null).length}rem)` : ''}
  class:red={diff && ['replace', 'delete', 'update'].includes(diffComponentObj.type)}>
  <slot {component} {path} node={currentNode} />
</json-node-wrapper>

{#if diff && (['insertAsFirstChild', 'update', 'replace'].includes(diffComponentObj.type) || (!currentNode.expanded && diffComponentObj.type == 'insertAsRightSibling'))}
  <json-diff-wrapper
    style={diffIndentStyle}
    class="green{diffComponentObj.type.startsWith('insert') ? ' ml-4' : ''}">
    <svelte:component
      this={diffComponentObj.component}
      props={diffComponentObj.data} />
  </json-diff-wrapper>
{/if}

{#if !currentNode.expanded}
  {#each additionalDiffs as nextDiff}
    <json-diff-wrapper style={nextDiff[1]} class="green ml-4">
      <svelte:component this={nextDiff[0].component} props={nextDiff[0].data} />
    </json-diff-wrapper>
  {/each}
{/if}

{#each deferredDiffs as defferedDiff}
  <json-diff-wrapper style={defferedDiff[1]} class="green ml-4">
    <svelte:component
      this={defferedDiff[0].component}
      props={defferedDiff[0].data} />
  </json-diff-wrapper>
{/each}
