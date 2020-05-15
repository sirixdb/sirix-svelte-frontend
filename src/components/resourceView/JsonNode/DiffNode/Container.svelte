<script>
  export let child;
  export let data;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  $: isArray = Array.isArray(data);
  $: items = Object.entries(data).length;

  import Arrow from "icons/Arrow.svelte";
  import { expandAndFade } from "utils/transition.js";
</script>

<span on:click|stopPropagation={toggleExpansion}>
  <Arrow {expanded} />
  {#if isArray}<i>array</i> [ ]{:else}{@html '<i>object</i> { }'}{/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local class="pl-4">
    {#each child as item}
      <div>
        <svelte:component
          this={item.component}
          data={item.data}
          child={item.child} />
      </div>
    {/each}
  </div>
{/if}
