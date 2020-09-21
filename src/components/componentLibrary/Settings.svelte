<script lang="ts">
  import { settingsStore } from "../../lib/db_stores";
  import Settings from "./settings/SettingsImpl.svelte";
  import { openModal } from "renderless-svelte";
</script>

<span
  class="inline-block m-1 p-0 cursor-pointer bg-green-300 rounded-full
  text-center text-lg font-black text-green-900"
  on:click={() => openModal({ component: Settings, props: { settingsStore } })}>
  &#9881;&#65039;
</span>
