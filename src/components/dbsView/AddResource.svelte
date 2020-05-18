<script lang="typescript">
  export let showForm: boolean;
  export let dbName: string;
  export let dbType: string;
  let resourceName: string;
  let submitting = false;
  let file = "";
  let fileName = "";

  // use file name as default resourceName, if no name has been provided
  $: resourceName =
    fileName !== "" && resourceName === undefined ? fileName : resourceName;

  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";

  import Dropzone from "./Dropzone.svelte";

  const formSubmit = () => {
    submitting = true;
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .create(file)
        .then(() => {
          dbInfo.update(arr => {
            return Object.assign(arr, sirix.sirixInfo.databaseInfo);
          });
          submitting = false;
          showForm = false;
        });
    });
  };
  // class style values
  const base = "bg-blue-500 text-white font-bold py-2 px-4 rounded";
  const enabled = base + " hover:bg-blue-700";
  const disabled = base + " opacity-50 cursor-not-allowed";
  const loading = base + " opacity-50 cursor-wait";
</script>

<form class="text-center">
  <div class="p-2 m-2 inline-block">
    <span class="w-1/2">
      <label class="block text-left" for="name">Resource Name</label>
      <input
        required
        bind:value={resourceName}
        type="text"
        name="name"
        class="text-lg p-2 rounded-sm" />
    </span>
    <Dropzone {dbType} bind:file bind:fileName />
  </div>
  <div>
    <button
      class={submitting ? loading : resourceName === '' || resourceName === undefined || file === '' ? disabled : enabled}
      type="button"
      disabled={submitting || resourceName === '' || resourceName === undefined || file === ''}
      on:click={formSubmit}>
      Create
    </button>
  </div>
</form>
