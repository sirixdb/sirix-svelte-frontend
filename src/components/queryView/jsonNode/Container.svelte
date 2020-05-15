<script>
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let hover = false;
  export let expanded = false;
  export let index = null;
  export let data;
  export let keyValue = false;
  $: isArray = Array.isArray(data);
  $: children = isArray ? data : Object.entries(data);

  import Arrow from "icons/Arrow.svelte";
  // transformations
  import { expandAndFade } from "utils/transition.js";
  import { Key, Value } from "./nodes.js";
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if !keyValue}
    <Arrow {expanded} />
  {/if}
  {#if index !== null}{index}:{/if}
  {#if isArray}
    <i>array</i>
    [ ]
  {:else}
    <i>object</i>
    {'{ }'}
  {/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local class={hover ? 'bg-gray-300' : ''}>
    {#each children as n, index}
      {#if isArray}
        <div
          on:mouseover|stopPropagation={() => (hover = true)}
          on:mouseout|stopPropagation={() => (hover = false)}
          class="pl-4">
          <Value value={n} />
        </div>
      {:else}
        <div
          on:mouseover|stopPropagation={() => (hover = true)}
          on:mouseout|stopPropagation={() => (hover = false)}
          class="pl-4">
          <Key key={n[0]} value={n[1]} />
        </div>
      {/if}
    {/each}
  </div>
{/if}
