<script>
  import { TabControl, TabControlItem } from "renderless-svelte";
  import LazyLoadingSettings from "./LazyLoadingSettings.svelte";
  import PaginationSettings from "./PaginationSettings.svelte";

  export let settingsStore;
  export let close;
  close;
</script>

<style>
  button {
    width: 150px;
  }
</style>

<tab-control class="flex mt-4">
  <TabControl>
    <div class="tabs flex flex-col" slot="tabs" let:tabs>
      {#each tabs as { active, disabled, payload, select }}
        <button class:active on:click={select} {disabled}>{payload}</button>
      {/each}
    </div>
    <div class="tab">
      <TabControlItem id="lazy-loading" payload="Lazy Loading" active>
        <LazyLoadingSettings {settingsStore} />
      </TabControlItem>
      <TabControlItem id="paging" payload="Row Paging">
        <PaginationSettings {settingsStore} />
      </TabControlItem>
    </div>
  </TabControl>
</tab-control>
