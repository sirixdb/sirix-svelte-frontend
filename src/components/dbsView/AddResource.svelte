<script lang="typescript">
  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";

  import Dropzone from "@componentLibrary/Dropzone.svelte";
  import ProgressBar from "@componentLibrary/ProgressBar.svelte";
  import { DBType } from "sirixdb";

  export let close: Function;
  export let dbName: string;
  export let dbType: string;
  let resourceName = "";
  let submitting = false;
  let file = "";
  let fileName = "";
  let progress = 0;

  // use file name as default resourceName, if no name has been provided
  $: resourceName =
    fileName !== "" && resourceName === "" ? fileName : resourceName;

  const formSubmit = () => {
    submitting = true;
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource.createBrowser(file, {
      uploadProgressCallback: (event: ProgressEvent) => {
        if (event.lengthComputable) {
          progress = Math.round((event.loaded * 100) / event.total);
        }
      },
      loadCallback: (e) => {
        sirix.getInfo().then((data) => {
          dbInfo.set(data);
        });
        submitting = false;
        close();
      },
      errorCallback: (e) => {},
    });
  };
  // class style values
  const base = "bg-blue-500 text-white font-bold py-2 px-4 rounded";
  const enabled = base + " hover:bg-blue-700";
  const disabled = base + " opacity-50 cursor-not-allowed";
  const loading = base + " opacity-50 cursor-wait";
</script>

<style>
  .align-initial {
    text-align: initial;
  }
</style>

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
  <div class="{submitting ? '' : 'invisible'} mt-2">
    <div class="inline-block h-24 w-24 center align-initial">
      <ProgressBar value={progress} />
    </div>
  </div>
</form>
