<script lang="ts">
  import { dbInfo, refreshHistory } from "../../store";

  const refresh = () => refreshHistory.refresh();

  let height;
</script>

<span
  title="refresh"
  bind:clientHeight={height}
  on:click={refresh}
  style="width: {height}px"
  class="inline-block float-left m-1 p-0 cursor-pointer bg-green-300
  rounded-full text-center text-lg font-black text-green-900">
  &#8635;
</span>
