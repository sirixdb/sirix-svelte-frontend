<script lang="ts">
  import type { settingsStore as settingsStoreType } from "../../../lib/db_stores";

  export let settingsStore: typeof settingsStoreType;
  let initialDepth = $settingsStore["lazy-loading"].initialDepth;
  let lazyLoadDepth = $settingsStore["lazy-loading"].lazyLoadDepth;

  const submit = async () => {
    await settingsStore.setLazyLoadIng({ initialDepth, lazyLoadDepth });
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
    <span class="flex-grow">Initial Load Depth (in nodes)</span>
    <input type="number" min="2" bind:value={initialDepth} />
  </label>
  <label class="flex flex-row">
    <span class="flex-grow">Lazy Load Depth (in nodes)</span>
    <input type="number" min="1" bind:value={lazyLoadDepth} />
  </label>
  <button type="submit">Save</button>
</form>
