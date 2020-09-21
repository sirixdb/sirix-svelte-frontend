<script lang="ts">
  import type { settingsStore as settingsStoreType } from "../../../lib/db_stores"

  export let settingsStore: typeof settingsStoreType;
  let pagination = $settingsStore.globalPagination;

  const submit = () => {
    pagination !== $settingsStore.globalPagination &&
      settingsStore.setPagination(pagination);
  };
</script>

<style>
  form {
    text-align: center;
  }
  label {
    display: flex;
    flex-direction: row;
    border-bottom-style: solid;
    border-radius: 4px;
    border-width: 1px;
    border-color: gray;
    padding: 0 10px;
    margin-bottom: 10px;
  }
</style>

<form on:submit|preventDefault={submit}>
  <label>
    Pagination (in nodes) <input type="number" min="10" bind:value={pagination} />
  </label>
  <button type="submit">Save</button>
</form>
