<script lang="typescript">
  import AddDatabase from "./AddDatabase.svelte";
  import { openModal } from "renderless-svelte";

  let form = false;
  let showForm = () => {
    openModal({component: AddDatabase});
  };
</script>

<span
  on:click={showForm}
  class="text-lg font-semibold text-blue-900 bg-blue-300 rounded-full
  cursor-pointer hover:bg-blue-200 m-2 p-2 inline-block">
  Add Database
</span>
