<script>
  export let props;

  import { keyFuncReg } from "./functions";

  let hover = false;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let index;
  let childNode;
  let childNodes;

  let key, treeNode, path, nodeKey, nodeType, childs;

  import { NodeType } from "sirix/src/info";

  $: {
    ({ key, treeNode, path, nodeKey, nodeType, childs } = props);
    if (nodeType !== NodeType.OBJECT_KEY) {
      childNodes = childs;
      // check if we have an empty object, not encased in an array
      if (!Array.isArray(childNodes)) {
        childNodes = [];
      }
    } else {
      childNode = childs;
    }
  }

  // get the key for reaching the current node from the parent node
  // if the current node is an OBJECT_KEY, then the key attribute is the key
  key =
    nodeType === NodeType.OBJECT_KEY
      ? key
      : // we are inside an array, so the index is the key
        index;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: if (hover && Object.keys(childNode).length === 0) {
    dispatch("loadDeeper", {
      path,
      key: nodeKey,
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
    this={treeNode.component}
    props={treeNode.props}
    bind:expanded
    {hover}
    on:loadDeeper />
</span>
