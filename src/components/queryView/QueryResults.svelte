<script>
  import QueryResult from "./QueryResult.svelte";
  import { dataStore, subTreeStore } from "./store.js";
  import { syntaxHighlight } from "lib/json_utils.js";
  let results;
  $: {
    results = $dataStore.rest;
    results = results ? results : [];
  }
  $: subTree =
    $subTreeStore !== undefined ? syntaxHighlight($subTreeStore) : "";
</script>

<section class="flex">
  <div class="w-1/2">
    {#if $dataStore.rest}
      <div>
        <b>
          <i>Response:</i>
        </b>
      </div>
      {#each results as result}
        <div class="px-2">
          <QueryResult data={result} />
        </div>
        <br />
      {/each}
    {/if}
  </div>
  <div class="w-1/2">
    <pre class="text-sm">{@html subTree}</pre>
  </div>
</section>
