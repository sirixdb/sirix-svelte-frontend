<script>
  import QueryBox from "./QueryBox.svelte";
  import QueryResults from "./QueryResults.svelte";
  import ControlPanel from "./controlPanel/Panel.svelte";
  import { Notification } from "renderless-svelte";
</script>

<div class="flex">
  <div class="relative" style="width: 70vw;">
    <QueryBox />
    <Notification let:payload duration={3500}>
      <div class="fixed bg-red-100 text-gray-900 w-1/2 p-2 font-bold">{payload}</div>
    </Notification>
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
