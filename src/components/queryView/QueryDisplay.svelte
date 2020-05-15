<script>
  import QueryBox from "./QueryBox.svelte";
  import QueryResults from "./QueryResults.svelte";
  import ControlPanel from "./controlPanel/Panel.svelte";
</script>

<style>
  .scroll::-webkit-scrollbar {
    width: 0.5rem;
  }
  .scroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .scroll::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
</style>

<div class="flex">
  <div class="scroll" style="width: 70vw;">
    <QueryBox />
    <div
      style="height: calc(100vh - 199px); width: 70vw;"
      class="mr-0 bg-gray-100 overflow-scroll">
      <QueryResults />
    </div>
  </div>

  <div class="scroll bg-purple-100" style="width: 30vw">
    <ControlPanel />
  </div>
</div>
