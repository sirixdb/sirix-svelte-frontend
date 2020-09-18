<script lang="typescript">
  export let close: Function;
  export let dbName: string;
  export let dbType: string;
  export let resourceName: string = undefined;

  import Trash from "../icons/Trash.svelte";

  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";

  import {
    dbInfo,
    selected,
    refreshResource,
    refreshHistory,
  } from "../../store";

  const refresh = () => {
    sirix.getInfo().then((res) => {
      dbInfo.set(res);
    });
    refreshResource.refresh();
    refreshHistory.refresh();
  };

  const del = () => {
    const db = sirix.database(
      dbName,
      dbType === "json" ? DBType.JSON : DBType.XML
    );
    if (resourceName !== undefined) {
      db.resource(resourceName)
        .delete(null, null)
        .then(() => {
          selected.update((sel) => {
            if (sel.dbName === dbName && sel.resourceName === resourceName) {
              sel.resourceName = null;
              sel.revision = 0;
            }
            return sel;
          });
          close();
          refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      db.delete()
        .then(() => {
          selected.update((sel) => {
            if (sel.dbName === dbName) {
              sel.dbName = null;
              sel.resourceName = null;
            }
            return sel;
          });
          close();
          refresh();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
</script>

<div class="text-center">
  {#if resourceName}
    <h3>
      Are you <b>sure</b> you want to delete Resource <i>({dbName})/{resourceName}</i>
      ?
    </h3>
  {:else}
    <h3>Are you <b>sure</b> you want to delete Database <i>{dbName}</i> ?</h3>
  {/if}
  <button
    type="button"
    on:click={del}
    class="bg-red-600 rounded-lg text-gray-200 m-2">
    <span class="uppercase">Delete</span>
    <Trash color="#FFF" size={16} />
  </button>
</div>
