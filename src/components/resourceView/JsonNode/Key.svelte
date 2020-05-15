<script>
  export let props;

  let hover = false;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  // silence the compiler
  export let index = undefined;
  index;

  let childNode;
  let childNodes;

  let key, treeNode, path, nodeKey, nodeType, childs;

  import { NodeType } from "sirix/src/info";

  $: {
    ({ key, treeNode, path, nodeKey, nodeType, childs } = props);
    childNode = childs;
  }

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: if (hover && Object.keys(childNode).length === 0) {
    dispatch("loadDeeper", {
      path,
      key: nodeKey,
      insertKey: null
    });
  }

  import Arrow from "icons/Arrow.svelte";
  // transformations
  import { expandAndFade } from "utils/transition.js";
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
