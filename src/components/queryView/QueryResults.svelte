<script>
  import QueryResult from "./QueryResult.svelte";
  import { dataStore, subTreeStore } from "./store.js";
  let results;
  $: {
    results = $dataStore.rest;
    results = results ? results : [];
  }
</script>

{#if $dataStore.rest}
  <div>
    <b>
      <i>Response:</i>
    </b>
  </div>
  {#each results as result, index}
    <div class="px-2">
      <QueryResult data={result} {index} />
    </div>
    <br />
  {/each}
{/if}
