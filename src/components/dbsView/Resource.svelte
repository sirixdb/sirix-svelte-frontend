<script lang="ts">
  export let resourceName: string;
  export let dbName: string;
  export let dbType: string;

  import { selected } from "../../store";
  const selectResource = () => {
    selected.set({ dbName, dbType, resourceName });
  };

  import DeleteDialog from "./DeleteDialog.svelte";

  import Trash from "../icons/Trash.svelte";

  let showDeleteDialog = false;

  let height: number;
</script>

<div
  class="cursor-pointer text-gray-100 opacity-100 hover:bg-gray-700 p-2 m-1 mr-2
  ml-8 overflow-hidden rounded-full"
  on:click={selectResource}>
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
