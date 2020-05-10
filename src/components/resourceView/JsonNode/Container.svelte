<script>
  export let props;
  import { containerFuncReg } from "./functions";

  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let hover = false;
  export let expanded = false;
  export let index = null;

  import { NodeType } from "sirix/src/info";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let treeNode, path, nodeKey, childCount, nodeType, diff;
  $: ({ treeNode, path, nodeKey, childCount, nodeType, diff } = props);

  $: if (hover && childCount !== Object.keys(treeNode).length) {
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

<style>
  div {
    contain: content;
  }
</style>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if path[path.length - 1] !== null}
    <Arrow {expanded} />
  {/if}
  {#if index !== null}{index}:{/if}
  {#if nodeType === NodeType.ARRAY}
    [{childCount}]
  {:else}{'{' + childCount + '}'}{/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local class={hover ? 'bg-gray-300' : ''}>
    {#each treeNode as n, index}
      <div
        on:mouseover|stopPropagation={() => (hover = true)}
        on:mouseout|stopPropagation={() => (hover = false)}
        class="pl-4">
        <svelte:component
          this={n.component}
          props={n.props}
          {index}
          on:loadDeeper />
      </div>
    {/each}
  </div>
{/if}

{#if diff}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}
