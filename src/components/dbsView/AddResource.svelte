<script lang="typescript">
  export let showForm: boolean;
  export let dbName: string;
  export let dbType: string;
  let resourceName = "";
  let submitting = false;
  let file = "";
  let fileName = "";

  // use file name as default resourceName, if no name has been provided
  $: resourceName =
    fileName !== "" && resourceName === "" ? fileName : resourceName;

  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";

  import Dropzone from "./Dropzone.svelte";
  import { DBType } from "sirixdb";

  const formSubmit = () => {
    submitting = true;
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource.create(file).then((resp) => {
      sirix.getInfo().then((data) => {
        dbInfo.set(data);
      });
      submitting = false;
      showForm = false;
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
      class={submitting ? loading : resourceName === '' || file === '' ? disabled : enabled}
      type="button"
      disabled={submitting || (resourceName === '') === undefined || file === ''}
      on:click={formSubmit}>
      Create
    </button>
  </div>
</form>
