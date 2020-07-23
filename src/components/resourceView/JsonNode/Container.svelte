<script>
  import VirtualList from "@componentLibrary/VirtualList.svelte";

  export let props;
  export let firstLevel = false;

  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let hover = false;
  export let expanded = false;
  export let index = null;

  import { NodeType } from "sirixdb";

  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  let treeNode, path, nodeKey, childCount, nodeType, diff;
  $: ({ treeNode, path, nodeKey, childCount, nodeType, diff } = props);

  $: if (hover && childCount !== Object.keys(treeNode).length) {
    dispatch("loadDeeper", {
      path,
      key: nodeKey,
      insertKey: null,
    });
  }

  import { diffView } from "../../../store";

  import Arrow from "../../icons/Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";
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
    style="height: {firstLevel ? 'calc(100vh - 89px)' : `${treeNode.length * 24}px`}"
    class={hover ? 'bg-gray-300' : ''}>
    <VirtualList items={treeNode} let:index let:item>
      <div
        on:mouseover|stopPropagation={() => (hover = true)}
        on:mouseout|stopPropagation={() => (hover = false)}
        class="pl-4">
        <svelte:component
          this={item.component}
          props={item.props}
          {index}
          on:loadDeeper />
      </div>
    </VirtualList>
  </div>
{/if}

{#if expanded && diff && diff.position === 'after'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}

<!--
{#if lastLine < treeNode.length}
  <div style="height: {(treeNode.length - lastLine) * 24}px" />
{/if}-->
