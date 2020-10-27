<script lang="ts">
  import type { settingsStore as settingsStoreType } from "../../../lib/db_stores";

  export let settingsStore: typeof settingsStoreType;
  let maxChildren = $settingsStore["pagination-size"].maxChildren;
  let numberOfNodes = $settingsStore["pagination-size"].numberOfNodes;

  const submit = async () => {
    await settingsStore.setPagination({ maxChildren, numberOfNodes });
  };
</script>

<style>
  label {
    border-bottom-style: solid;
    border-radius: 4px;
    border-width: 1px;
    border-color: gray;
    padding: 5px 10px;
    margin-bottom: 10px;
  }
</style>

<form class="text-center" on:submit|preventDefault={submit}>
  <label class="flex flex-row">
    <span class="flex-grow">maxChildren (in nodes)</span>
    <input type="number" min="20" bind:value={maxChildren} />
  </label>
  <label class="flex flex-row">
    <span class="flex-grow">numberOfNodes</span>
    <input type="number" min="100" bind:value={numberOfNodes} />
  </label>
  <button type="submit">Save</button>
</form>
