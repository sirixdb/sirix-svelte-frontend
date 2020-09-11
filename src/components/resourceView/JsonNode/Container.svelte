<script lang="ts">
  import VirtualList from "../../componentLibrary/VirtualList.svelte";
  import type { ContainerProps } from "./functions";
  import type { Diff } from "../buildTree";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let props: ContainerProps;

  //@ts-ignore
  let maxHeight = document.querySelector("#resource-view").offsetHeight - 30;

  export let hover = false;
  export let expanded = false;
  export let index = null;

  let childrenExpanded = [];
  let transition = 0;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  import { NodeType } from "sirixdb";

  let treeNode: any,
    path: Array<string | number | null>,
    nodeKey: number,
    childCount: number,
    nodeType: NodeType,
    diff: ?Diff;
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

{#if diff && diff.diffNode.delete !== undefined}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}

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
  {:else}<i>object</i> {$diffView ? '{ }' : `{${childCount}}`}{/if}
</span>

{#if expanded && diff && diff.position === 'child'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}

{#if expanded}
  <VirtualList {maxHeight} items={treeNode} let:index let:item>
    <div
      on:mouseover|stopPropagation={() => (hover = true)}
      on:mouseout|stopPropagation={() => (hover = false)}
      class="pl-4">
      <svelte:component
        this={item.component}
        props={item.props}
        bind:expanded={childrenExpanded[index]}
        {index}
        on:loadDeeper />
    </div>
  </VirtualList>
{/if}

{#if expanded && diff && diff.position === 'after'}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}
