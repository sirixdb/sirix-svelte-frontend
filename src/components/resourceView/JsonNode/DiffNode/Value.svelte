<script>
  export let index;
  export let child;

  let textColor;

  $: {
    textColor =
      typeof child === "number"
        ? "text-green-600"
        : typeof child === "string"
        ? "text-orange-900"
        : "text-indigo-600";
  }
</script>

{#if index !== undefined}
  <span>{index}:</span>
{/if}

<span style="color:{textColor}">"{child}"</span>
