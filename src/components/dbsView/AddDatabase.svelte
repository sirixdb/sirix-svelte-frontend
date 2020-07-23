<script lang="typescript">
  export let showForm: boolean;
  let name = "";
  let dbType = "";
  let submitting = false;

  import { sirix } from "../../sirix";
  import { dbInfo } from "../../store";
  import { DBType } from "sirixdb";

  const formSubmit = () => {
    submitting = true;
    const db = sirix.database(
      name,
      dbType === "json" ? DBType.JSON : DBType.XML
    );
    db.create().then(() => {
      sirix.getInfo().then((info) => {
        dbInfo.set(info);
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

  import Radio from "../componentLibrary/Radio.svelte";
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
  <div class="p-2 m-2 text-center">
    <label for="type">
      <h2>Database Type</h2>
    </label>
    <Radio
      options={[{ text: 'XML', value: 'xml' }, { text: 'JSON', value: 'json' }]}
      name={'type'}
      bind:selected={dbType} />
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
