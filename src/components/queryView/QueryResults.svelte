<script>
  import QueryResult from "./QueryResult.svelte";
  import { dataStore } from "./store";
  let results;
  $: {
    results = $dataStore.rest;
    results = results ? results : [];
  }
</script>

{#each results as result}
  <div class="px-2">
    <QueryResult data={result} />
  </div>
{/each}
