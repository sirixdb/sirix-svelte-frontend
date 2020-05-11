<script>
  import { selected } from "../../store";

  export let diffColumn = false;

  export let history = [];

  let reverse = false;
  $: selected.update(sel => {
    return { ...sel, diff: null };
  });

  let list;
  // return new reversed list, if reverse is true
  $: list = reverse ? history.slice().reverse() : history;

  let dbName = "",
    dbType = "",
    resourceName = "";

  import Commit from "./Commit.svelte";
  import Slider from "./Slider.svelte";
  import DiffOption from "./DiffOption.svelte";
  import Refresh from "./Refresh.svelte";

  let width;
  export let offset;
</script>

<style>
  #fade-screen {
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 1)
    );
  }
</style>

<!-- NOTE we only need this #if because the history tree is constant -->
{#if list.length !== 0}
  <div
    style="width: {width}px; top: {offset}px;"
    id="fade-screen"
    class="py-2 absolute z-10">
    <div class="z-20">
      {#if !diffColumn}
        <Refresh />
        <DiffOption />
      {/if}
      <Slider bind:checked={reverse} id={diffColumn ? 'diff' : 'history'} />
    </div>
  </div>

  <div class="mt-6" bind:clientWidth={width}>
    <ul class="ml-0 my-0 max-h-screen list-none inline">
      {#each list as commit}
        <Commit {commit} {diffColumn} />
      {/each}
    </ul>
  </div>
{/if}
