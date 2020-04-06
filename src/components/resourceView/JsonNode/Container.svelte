<script>
  export let props;

  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let hover = false;
  export let expanded = false;
  export let index = null;

  import Arrow from "./Arrow.svelte";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";

  import { NodeType } from "sirix/src/info";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  $: if (hover && props.node.metadata.childCount !== Object.keys(props.treeNode).length) {
    dispatch("loadDeeper", {
      path: props.path,
      key: props.node.metadata.nodeKey,
      insertKey: null
    });
  }
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if props.path[props.path.length - 1] !== null}
    <Arrow {expanded} />
  {/if}
  {#if index !== null}{index}:{/if}
  {#if props.node.metadata.type === NodeType.ARRAY}
    [{props.node.metadata.childCount}]
  {:else}{'{' + props.node.metadata.childCount + '}'}{/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local>
    {#each props.treeNode as n, index}
      <div
        on:mouseover|stopPropagation={() => (hover = true)}
        on:mouseout|stopPropagation={() => (hover = false)}
        class="pl-4 {hover ? 'bg-gray-300' : ''}">
        <svelte:component
          this={n.component}
          props={{ node: n.node, treeNode: n.child, path: n.path, diff: n.diff }}
          {index}
          on:loadDeeper />
      </div>
    {/each}
  </div>
{/if}
