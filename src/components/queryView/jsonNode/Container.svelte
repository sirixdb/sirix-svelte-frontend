<script lang="typescript">
  import { getContext } from "svelte";
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  export let hover: boolean = false;
  export let depth: number;
  // automatically open show first 3 levels, including root
  export let expanded = depth < 2 ? true : false;
  export let index = null;
  export let data;
  export let keyValue: boolean = false;
  $: isArray = Array.isArray(data);
  $: children = isArray ? data : Object.entries(data);

  import { subTreeStore } from "../store.js";

  const resultIndex = getContext("resultIndex") as number;

  const handleClick = () => {
    console.log(resultIndex)
    subTreeStore.update(old => {
      old[resultIndex] = data
      return old;
    });
  };

  import Arrow from "../../icons/Arrow.svelte";
  import ArrowRight from "../../icons/ArrowRight.svelte";
  import { Key, Value } from "./nodes.js";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";
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
    [{children.length}]
  {:else}
    <i>object</i>
    {`{${children.length}}`}
  {/if}
  <span
    class="hover:bg-teal-100 rounded-full inline-block align-bottom"
    on:click|stopPropagation={handleClick}>
    <ArrowRight size={22} />
  </span>
</span>

{#if expanded}
  <div
    transition:expandAndFade|local
    class={hover ? 'bg-gray-300' : ''}
    on:mouseover|stopPropagation={() => (hover = true)}
    on:mouseout|stopPropagation={() => (hover = false)}>
    {#each children as n, index}
      {#if isArray}
        <div class="pl-4">
          <Value value={n} depth={depth + 1} />
        </div>
      {:else}
        <div
          on:mouseover|stopPropagation={() => (hover = true)}
          on:mouseout|stopPropagation={() => (hover = false)}
          class="pl-4">
          <Key depth={depth + 1} key={n[0]} value={n[1]} />
        </div>
      {/if}
    {/each}
  </div>
{/if}
