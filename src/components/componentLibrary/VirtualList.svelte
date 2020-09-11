<script lang="ts">
  import { virtualize } from "./virtualList";

  export let items: any[];
  export let maxHeight: number;
  export let defaultItemHeight = 24;

  let startIndex = 0,
    endIndex = 0;
</script>

<style>
  virtual-list,
  virtual-list-row {
    display: block;
  }
</style>

<virtual-list
  use:virtualize={{ itemsCount: items.length, maxHeight, averageHeight: defaultItemHeight }}
  on:virtualize={({ detail }) => {
    startIndex = detail.startIndex;
    endIndex = detail.endIndex;
  }}
  class="overflow-y-auto scroll scrolling-touch">
  <virtual-list-row>
    {#each items.slice(startIndex, endIndex + 1) as item, index}
      <slot {item} {index} />
    {/each}
</virtual-list>
