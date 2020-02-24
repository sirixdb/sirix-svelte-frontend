<script lang="ts">
  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { selected, refreshHistory } from "../../store";

  let history = [];

  let reverse = false;
  let list;
  // return new reversed list, if reverse is true
  $: list = reverse ? history.slice().reverse() : history;

  let dbName = "",
    dbType = "",
    resourceName = "";

  const unsubscribe1 = selected.subscribe(sel => {
    ({ dbName, dbType, resourceName } = sel);
    if (dbName === null || resourceName === null) {
      history = [];
    }
  });
  const unsubscribe2 = refreshHistory.subscribe(() => {
    if (dbName && resourceName && dbType) {
      sirix.database(dbName).then(db => {
        db.resource(resourceName)
          .history()
          .then(res => {
            history = res;
          });
      });
    }
  });
  onDestroy(unsubscribe1);
  onDestroy(unsubscribe2);

  import { blur } from "svelte/transition";

  import Commit from "./Commit.svelte";
  import Slider from "./Slider.svelte";
  import Refresh from "./Refresh.svelte";

  let width;
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

<!-- NOTE we shouldn't need this #if once this tree is not constant -->
{#if list.length !== 0}
  <div style="width: {width}px" id="fade-screen" class="py-2 fixed z-10">
    <div class="z-20">
      <Refresh bind:list={history} />
      <Slider bind:checked={reverse} />
      &nbsp;
      {#if reverse}
        <span class="fixed" transition:blur={{ amount: 3, duration: 200 }}>Descending</span>
      {:else}
        <span class="fixed" transition:blur={{ amount: 3, duration: 200 }}>Ascending</span>
      {/if}
    </div>
  </div>

  <div class="mt-6" bind:clientWidth={width}>
    <ul class="ml-0 my-0 max-h-screen list-none inline">
      {#each list as commit}
        <Commit {commit} />
      {/each}
    </ul>
  </div>
{/if}
