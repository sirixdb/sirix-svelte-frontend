<script>
  export let key;
  export let value;

  let hover = false;

  let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  // silence the compiler
  export let index = undefined;
  index;

  let valueIsArray, valueIsObject;
  $: {
    valueIsArray = Array.isArray(value);
    valueIsObject = !valueIsArray && typeof value === "object" && value !== null;
  }

  import Arrow from "icons/Arrow.svelte";
  // transformations
  import { expandAndFade } from "utils/transition.js";

  import { Value, Container } from "./nodes.js";
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if valueIsArray || valueIsObject}
    <Arrow {expanded} />
  {/if}
  {key}:
</span>

<span transition:expandAndFade|local>
  {#if valueIsArray || valueIsObject}
  <Container
    keyValue={true}
    data={value}
    bind:expanded
    {hover} />
  {:else}
  <Value {value} />
  {/if}
</span>
