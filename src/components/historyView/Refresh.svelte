<script lang="ts">
  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";

  export let current;
  export let list;

  let dbName, dbType, resourceName;

  $: {
    ({ dbName, dbType, resourceName } = current);
  }

  const refresh = () => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .history()
        .then(history => {
          list = history;
        });
    });
  };
  let height;
</script>

<span
  bind:clientHeight={height}
  on:click={refresh}
  style="width: {height}px"
  class="inline-block m-1 p-0 cursor-pointer bg-green-300 rounded-full
  text-center text-lg font-black text-green-900">
  &#8635;
</span>
