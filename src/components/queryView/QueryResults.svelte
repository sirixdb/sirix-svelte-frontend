<script>
  import QueryResult from "./QueryResult.svelte";
  import { dataStore } from "./store";
  let header, results;
  $: {
    header = Object.keys($dataStore)[0];
    results = $dataStore[header];
    header = header ? header : "";
    results = results ? results : [];
  }
</script>

<div>{header}</div>
{#each results as result}
  <QueryResult data={result} />
{/each}
