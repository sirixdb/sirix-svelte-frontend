<script>
  export let child;
  export let data;
</script>

<span>{data}:</span>

<svelte:component this={child.component} child={child.data} />
