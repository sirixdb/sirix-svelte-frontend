<script lang="ts">
  import { virtualize } from "./virtualList";

  export let items: any[];
  export let maxHeight: number;
  export let defaultItemHeight = 24;

  $: rows = items.map((item, i) => {
    return {i, item}
  });

  let startIndex = 0,
    endIndex = 0;
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
  class="overflow-y-auto scroll scrolling-touch">
  <virtual-list-row>
    {#each rows.slice(startIndex, endIndex + 1) as row}
      <slot item={row.item} index={row.i} />
    {/each}
  </virtual-list-row>
</virtual-list>
