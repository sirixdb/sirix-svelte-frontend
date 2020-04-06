<script>
  export let props;

  let hover = false;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let index;
  let childNode;
  let childNodes;

  import { NodeType } from "sirix/src/info";
  let nodeType = props.node.metadata.type;
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

  $: {
    if (nodeType !== NodeType.OBJECT_KEY) {
      childNodes = props.node.value;
      // check if we have an empty object, not encased in an array
      if (!Array.isArray(childNodes)) {
        childNodes = [];
      }
    } else {
      childNode = props.node.value;
    }
  }

  // get the key for reaching the current node from the parent node
  // if the current node is an OBJECT_KEY, then the key attribute is the key
  let key =
    nodeType === NodeType.OBJECT_KEY
      ? props.node.key
      : // we are inside an array, so the index is the key
        index;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: if (hover && Object.keys(childNode).length === 0) {
    dispatch("loadDeeper", {
      path: props.path,
      key: props.node.metadata.nodeKey,
      insertKey: null
    });
  }

  import Arrow from "./Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";
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
    this={props.treeNode.component}
    props={{ treeNode: props.treeNode.child, node: props.treeNode.node, path: props.treeNode.path }}
    bind:expanded
    {hover}
    on:loadDeeper />
</span>
