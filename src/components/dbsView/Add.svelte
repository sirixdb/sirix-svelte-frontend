<script lang="ts">
  import AddDialog from "./AddDialog.svelte";

  let form = false;
  let showForm = () => {
    form = true;
  };
</script>

<div
  on:click={showForm}
  class="text-lg font-semibold text-blue-900 bg-blue-300 rounded-full
  cursor-pointer hover:bg-blue-200 m-2 p-2 w-5/6 inline-block">
  Add Database
</div>
{#if form}
  <AddDialog bind:showForm={form} />
{/if}
