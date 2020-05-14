<script>
  import QueryBox from "./QueryBox.svelte";
  import QueryResults from "./QueryResults.svelte";
</script>

<style>
  div::-webkit-scrollbar {
    width: 0.5rem;
  }
  div::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  div::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
</style>

<QueryBox />
<div
  id="query-results"
  style="min-height: calc(100vh - 215px); width: 70vw;"
  class="mr-0 bg-gray-200 overflow-scroll float-right">
  <QueryResults />
</div>
