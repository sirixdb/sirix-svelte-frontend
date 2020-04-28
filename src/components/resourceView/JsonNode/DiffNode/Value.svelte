<script>
  export let index;
  export let child;
</script>

{#if index !== undefined}
  <span>{index}:</span>
{/if}

<span>{child}</span>
