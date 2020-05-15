<script>
  export let show;
  export let dbName;
  export let resourceName = null;
  let hideForm = () => (show = false);

  import Trash from "icons/Trash.svelte";

  import { sirix } from "../../sirix";

  import { dbInfo, selected, refreshResource, refreshHistory } from "store";

  const refresh = () => {
    dbInfo.update(arr => {
      return sirix.sirixInfo.databaseInfo.slice();
    });
    refreshResource.refresh();
    refreshHistory.refresh();
  };

  const del = () => {
    sirix.database(dbName).then(db => {
      if (resourceName !== null) {
        db.resource(resourceName)
          .deleteById(null)
          .then(() => {
            selected.update(sel => {
              if (sel.dbName === dbName && sel.resourceName === resourceName) {
                sel.resourceName = null;
                sel.revision = 0;
              }
              return sel;
            });
            hideForm();
            refresh();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        db.delete()
          .then(() => {
            selected.update(sel => {
              if (sel.dbName === dbName) {
                sel.dbName = null;
                sel.resourceName = null;
              }
              return sel;
            });
            hideForm();
            refresh();
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
  };
</script>

<style>
  .fixed {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>

<!-- The Modal -->
<div
  class="fixed left-0 top-0 w-full h-full z-10 overflow-auto bg-gray-900 z-30">

  <!-- Modal content -->
  <div
    class="bg-white text-black font-bold border-2 border-solid border-gray-600
    mt-56 m-auto max-w-lg w-7/12">
    <span class="cursor-pointer p-1" on:click={hideForm}>&times;</span>
    <div class="text-center">
      {#if resourceName}
        <h3>
          Are you
          <b>sure</b>
          you want to delete Resource
          <i>({dbName})/{resourceName}</i>
          ?
        </h3>
      {:else}
        <h3>
          Are you
          <b>sure</b>
          you want to delete Database
          <i>{dbName}</i>
          ?
        </h3>
      {/if}
      <button
        type="button"
        on:click={del}
        class="bg-red-600 rounded-lg text-gray-200 m-2">
        <span class="uppercase">Delete</span>
        <Trash color="#FFF" size="16" />
      </button>
    </div>
  </div>

</div>
