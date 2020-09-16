<script lang="ts">
  import { virtualize } from "./virtualList";

  export let items: any;
  export let maxHeight: number;
  export let defaultItemHeight = 24;

  let startIndex = 0;
  let endIndex = 0;
  const onVirtualize = ({ detail }) => {
    startIndex = detail.startIndex;
    endIndex = detail.endIndex;
  };
</script>

<style>
  virtual-list,
  virtual-list-row {
    display: block;
  }
</style>

<virtual-list
  use:virtualize={{ itemsCount: items.length, maxHeight, averageHeight: defaultItemHeight }}
  on:virtualize={onVirtualize}
  class="overflow-y-auto scroll">
  <virtual-list-row>
    {#each items.slice(startIndex, endIndex + 1) as row, index}
      <slot item={row} index={index + startIndex} />
    {/each}
  </virtual-list-row>
</virtual-list>
