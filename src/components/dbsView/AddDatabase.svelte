<script>
  export let showForm;
  let name = "";
  let dbType = "";
  let submitting = false;

  import { sirix } from "../../sirix";
  import { dbInfo } from "store";

  const formSubmit = () => {
    submitting = true;
    sirix.database(name, dbType).then(db => {
      dbInfo.update(arr => {
        return Object.assign(arr, sirix.sirixInfo.databaseInfo);
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
  <div class="p-2 m-2">
    <label for="name">Database Name</label>
    <input
      required
      bind:value={name}
      type="text"
      name="name"
      class="text-lg p-2 rounded-sm" />
  </div>
  <div class="p-2 m-2">
    <label for="type">Database Type</label>
    <label>
      <input
        type="radio"
        name="type"
        value="xml"
        bind:group={dbType}
        required />
      XML
    </label>
    <label>
      <input
        type="radio"
        name="type"
        value="json"
        bind:group={dbType}
        required />
      JSON
    </label>
  </div>
  <div>
    <button
      class={submitting ? loading : name !== '' && dbType !== '' ? enabled : disabled}
      type="button"
      disabled={submitting || name === '' || dbType === ''}
      on:click={formSubmit}>
      Create
    </button>
  </div>
</form>
