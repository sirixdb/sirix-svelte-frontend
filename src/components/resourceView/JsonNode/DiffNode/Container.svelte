<script>
  export let child;
  export let data;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  $: isArray = Array.isArray(data);
  $: items = Object.entries(data).length;

  import Arrow from "./../Arrow.svelte";
  import { expandAndFade } from "../../../../utils/transition";
</script>

<span on:click|stopPropagation={toggleExpansion}>
  <Arrow {expanded} />
  {#if isArray}[{items}]{:else}{'{' + items + '}'}{/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local>
    {#each child as item, index}
      <div>
        <svelte:component
          this={item.component}
          data={item.data}
          child={item.child}
          {index} />
      </div>
    {/each}
  </div>
{/if}
