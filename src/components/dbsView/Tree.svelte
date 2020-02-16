<script lang="ts">
  import Database from "./Database.svelte";
  import Add from "./Add.svelte";

  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";
</script>

<nav
  class="ml-0 my-0 bg-teal-900 min-h-full">
  <div>
    <Add />
    {#each $dbInfo as database (database.name)}
      <Database {database} />
    {/each}
  </div>
</nav>
