<script>
  export let props;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  import Arrow from "../../../icons/Arrow.svelte";
  import { expandAndFade } from "../../../../utils/transition.js";
</script>

<span on:click|stopPropagation={toggleExpansion}>
  <Arrow {expanded} />
  {#if props.type === 'array'}
    <i>array</i> [ ]
  {:else}
    {@html '<i>object</i> { }'}
  {/if}
</span>

{#if expanded}
  <div transition:expandAndFade|local class="pl-4">
    {#each props.data as item}
      <div class="pl-4">
        <svelte:component this={item.component} props={item} />
      </div>
    {/each}
  </div>
{/if}
