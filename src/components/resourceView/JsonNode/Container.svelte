<script lang="ts">
  export let node;
  export let treeNode;
  export let path: string[];

  export let hover: bool = false;
  export let expanded: bool = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let index = null;

  import Arrow from "./Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition";

  import { NodeType } from "sirix/src/info";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  $: if (hover && node.metadata.childCount !== Object.keys(treeNode).length) {
    dispatch("loadDeeper", {
      path,
      key: node.metadata.nodeKey,
      insertKey: null
    });
  }
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if path[path.length - 1] !== null}
    <Arrow {expanded} />
  {/if}
  {#if index !== null}{index}:{/if}
  {#if node.metadata.type === NodeType.ARRAY}
    [{node.metadata.childCount}]
  {:else}{'{' + node.metadata.childCount + '}'}{/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local>
    {#each treeNode as n, index}
      <div
        on:mouseover|stopPropagation={() => (hover = true)}
        on:mouseout|stopPropagation={() => (hover = false)}
        class="pl-4 {hover ? 'bg-gray-300' : ''}">
        <svelte:component
          this={n.component}
          node={n.node}
          treeNode={n.child}
          path={n.path}
          {index}
          on:loadDeeper />
      </div>
    {/each}
  </div>
{/if}
