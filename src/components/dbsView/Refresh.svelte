<script lang="typescript">
  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";

  const refresh = () => {
    sirix.getInfo().then(res => {
      dbInfo.set(res);
    });
  }
  let height: number;
</script>

<span
  title="refresh"
  bind:clientHeight={height}
  on:click={refresh}
  style="width: {height}px"
  class="inline-block m-1 p-0 cursor-pointer bg-green-300 rounded-full
  text-center text-lg font-black text-green-900">
  &#8635;
</span>
