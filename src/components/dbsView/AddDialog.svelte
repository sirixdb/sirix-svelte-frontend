<script lang="typescript">
  import AddDatabase from "./AddDatabase.svelte";
  import AddResource from "./AddResource.svelte";
  export let showForm: boolean;
  export let dbName: string = undefined;
  export let dbType: string = undefined;
  let hideForm = () => (showForm = false);
</script>

<style>
  .fixed {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>

<!-- The Modal -->
<div class="fixed left-0 top-0 w-full h-full z-10 overflow-auto bg-gray-900 z-30">

  <!-- Modal content -->
  <div
    class="bg-white text-black font-bold border-2 border-solid border-gray-600
    mt-56 m-auto max-w-lg w-7/12">
    <span class="cursor-pointer p-1" on:click={hideForm}>&times;</span>
    {#if dbName}
      <AddResource {dbName} {dbType} bind:showForm />
    {:else}
      <AddDatabase bind:showForm />
    {/if}
  </div>

</div>
