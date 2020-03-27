<script lang="ts">
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
  export let treeNode;
  export let path: string[];

  let hover = false;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let index;
  let childNode;
  let childNodes;

  import { NodeType } from "sirix/src/info";
  let nodeType = node.metadata.type;
  let textColor =
    nodeType === NodeType.STRING_VALUE ||
    nodeType === NodeType.OBJECT_STRING_VALUE ||
    nodeType === NodeType.OBJECT_KEY
      ? "text-orange-900"
      : nodeType === NodeType.NUMBER_VALUE ||
        nodeType === NodeType.OBJECT_NUMBER_VALUE
      ? "text-green-600"
      : // NULL or BOOLEAN
        "text-indigo-600";

  if (nodeType !== NodeType.OBJECT_KEY) {
    childNodes = node.value as MetaNode[];
    // check if we have an empty object, not encased in an array
    if (!Array.isArray(childNodes)) {
      childNodes = [];
    }
  } else {
    childNode = node.value as MetaNode;
  }

  // get the key for reaching the current node from the parent node
  // if the current node is an OBJECT_KEY, then the key attribute is the key
  let key =
    nodeType === NodeType.OBJECT_KEY
      ? node.key
      : // we are inside an array, so the index is the key
        index;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: if (hover && Object.keys(childNode).length === 0) {
    dispatch("loadDeeper", {
      path,
      key: node.metadata.nodeKey,
      insertKey: null
    });
  }

  import Arrow from "./Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition";
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if childNode.metadata.type === NodeType.OBJECT || childNode.metadata.type === NodeType.ARRAY}
    <Arrow {expanded} />
  {/if}
  {key}:
</span>

<span transition:expandAndFade|local>
  <svelte:component
    this={treeNode.component}
    treeNode={treeNode.child}
    node={treeNode.node}
    path={treeNode.path}
    {expanded}
    {hover}
    on:loadDeeper />
</span>
