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

  import { createEventDispatcher, onMount } from "svelte";
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

  import { diffView } from "../../../store";

  import Arrow from "./Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";

  let element;
  let timeout;
  let firstLine = 0;
  let lastLine = 125;
  async function redraw() {
    if (treeNode.length < 125) return;
    if (element) {
      const { top, bottom } = element.getBoundingClientRect();
      const calculated = firstLine - 50 + (top - 57) / -24;
      firstLine = calculated >= 0 ? calculated : 0;
      lastLine = firstLine + 100 + (window.innerHeight) / 24;
    }
    console.log(firstLine, lastLine)
    timeout = setTimeout(redraw, 1000);
  }
  onMount(redraw);
</script>

<style>
  div {
    contain: content;
  }
</style>

{#if expanded && diff && diff.position === 'before'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if path[path.length - 1] !== null}
    <Arrow {expanded} />
  {/if}
  {#if index !== null}{$diffView ? ' ' : index}:{/if}
  {#if nodeType === NodeType.ARRAY}
    <i>array</i>
    {$diffView ? '[ ]' : `[${childCount}]`}
  {:else}
    <i>object</i>
    {$diffView ? '{ }' : `{${childCount}}`}
  {/if}
</span>

{#if expanded && diff && diff.position === 'child'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}

{#if expanded}
  <div
    transition:expandAndFade|local
    bind:this={element}
    class={hover ? 'bg-gray-300' : ''}>
    {#each treeNode as n, index}
      {#if index >= firstLine && index <= lastLine}
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
      {/if}
    {/each}
  </div>
{/if}

{#if expanded && diff && diff.position === 'after'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}
