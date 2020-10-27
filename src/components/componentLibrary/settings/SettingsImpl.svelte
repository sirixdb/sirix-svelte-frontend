<script>
  import { TabControl, TabControlItem } from "renderless-svelte";
  import DepthLoadSettings from "./DepthLoadSettings.svelte";
  import BreadthLoadSettings from "./BreadthLoadSettings.svelte";

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
      <TabControlItem id="loading-depth" payload="Lazy Loading - Depth" active>
        <DepthLoadSettings {settingsStore} />
      </TabControlItem>
      <TabControlItem id="loading-breadth" payload="Loading - Breadth">
        <BreadthLoadSettings {settingsStore} />
      </TabControlItem>
    </div>
  </TabControl>
</tab-control>
