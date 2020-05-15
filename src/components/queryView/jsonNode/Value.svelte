<script>
  import { Container } from "./nodes.js";

  export let index = undefined;

  // to silence svelte from raising issues with props
  export let expanded = undefined;
  export let hover = undefined;
  expanded, hover;

  export let value;
  let textColor;
  let isContainer, isString;
  $: {
    isContainer = typeof value === "object" && value !== null;
    isString = typeof value === "string";
    if (!isContainer) {
      textColor = isString
        ? "text-orange-900"
        : typeof value === "number"
        ? "text-green-600"
        : // NULL or BOOLEAN
          "text-indigo-600";
    }
  }
  import { subTreeStore } from "../store.js";
  const handleClick = () => {
    subTreeStore.set(value);
  };

  import ArrowRight from "icons/ArrowRight.svelte";
  // transformations
  import { expandAndFade } from "utils/transition.js";
</script>

{#if index !== undefined}
  <span>{index}:</span>
{/if}

{#if isContainer}
  <Container data={value} />
{:else}
  <span class={textColor} transition:expandAndFade|local>
    {isString ? `"${value}"` : value}
  </span>
  <span
    class="hover:bg-teal-100 rounded-full inline-block align-bottom"
    on:click|stopPropagation={handleClick}>
    <ArrowRight size={22} />
  </span>
{/if}
