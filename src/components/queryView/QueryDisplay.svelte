<script>
  import QueryBox from "./QueryBox.svelte";
  import QueryResults from "./QueryResults.svelte";
  import ControlPanel from "./controlPanel/Panel.svelte";
</script>

<div class="flex">
  <div style="width: 70vw;">
    <QueryBox />
    <div
      style="height: calc(100vh - 199px); width: 70vw;"
      class="mr-0 bg-gray-100 overflow-scroll scroll">
      <QueryResults />
    </div>
  </div>

  <div class="scroll bg-purple-100" style="width: 30vw">
    <ControlPanel />
  </div>
</div>
