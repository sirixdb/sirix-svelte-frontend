<script>
  import AddDialog from "./AddDialog.svelte";

  let form = false;
  let showForm = () => {
    form = true;
  };
</script>

<span
  on:click={showForm}
  class="text-lg font-semibold text-blue-900 bg-blue-300 rounded-full
  cursor-pointer hover:bg-blue-200 m-2 p-2 inline-block">
  Add Database
</span>
{#if form}
  <AddDialog bind:showForm={form} />
{/if}
