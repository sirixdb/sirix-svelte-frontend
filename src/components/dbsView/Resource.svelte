<script>
  export let resourceName;
  export let dbName;
  export let dbType;

  import { selected, refreshHistory } from "store";
  const selectResource = () => {
    let refresh = true;
    selected.update(old => {
      if (old.dbName === dbName && old.resourceName === resourceName) {
        refresh = false;
      }
      return { dbName, dbType, resourceName, revision: 0, diff: null };
    });
    if (refresh) {
      refreshHistory.refresh();
    }
  };

  import DeleteDialog from "./DeleteDialog.svelte";

  import Trash from "icons/Trash.svelte";

  let showDeleteDialog = false;

  let height;
</script>

<div
  class="cursor-pointer text-gray-100 opacity-100 hover:bg-gray-700 p-2 m-1 mr-2
  ml-8 overflow-hidden rounded-full"
  on:click|stopPropagation={selectResource}>
  <span class="inline-block" bind:clientHeight={height}>{resourceName}</span>
  <span
    on:click|stopPropagation={() => (showDeleteDialog = true)}
    style="height: {height}px; width: {height}px;"
    class="float-right cursor-pointer bg-red-600 rounded-full text-center ml-2">
    <Trash color="#FFF" size={height > 0 ? height - 10 : height} />
  </span>
</div>

{#if showDeleteDialog}
  <DeleteDialog bind:show={showDeleteDialog} {resourceName} {dbName} />
{/if}
