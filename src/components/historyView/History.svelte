<script lang="ts">
  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { selected } from "../../store";
  let current = {
    dbName: "",
    dbType: "",
    resourceName: ""
  }
  const unsubscribe = selected.subscribe(sel => {
    let { dbName, dbType, resourceName } = sel;
    if (dbName && (dbName !== current.dbName || resourceName !== current.resourceName)) {
      loadHistory(dbName, resourceName);
      current = { dbName, dbType, resourceName }
    }
  });
  onDestroy(unsubscribe);

  let history = [];

  let reverse = false;
  let list;
  // return new reversed list, if reverse is true
  $: list = reverse ? history.slice().reverse() : history;

  const loadHistory = (dbName, resourceName): Promise<void> => {
    return sirix.database(dbName).then(db => {
      db.resource(resourceName)
        .history()
        .then(res => {
          history = res;
        });
    });
  };

  import { blur } from "svelte/transition";

  import Commit from "./Commit.svelte";
  import Slider from "./Slider.svelte";
</script>

<!-- NOTE we shouldn't need this #if once this tree is not constant -->
{#if list.length !== 0}
<div class="mt-1">
  <Slider bind:checked={reverse} />
  &nbsp;
  {#if reverse}
    <span class="fixed" transition:blur={{ amount: 3 }}>Descending</span>
  {:else}
    <span class="fixed" transition:blur={{ amount: 3 }}>Ascending</span>
  {/if}
</div>

<div>
  <ul class="ml-0 my-0 max-h-screen list-none inline">
    {#each list as commit (commit.revision)}
      <Commit {commit} />
    {/each}
  </ul>
</div>
{/if}