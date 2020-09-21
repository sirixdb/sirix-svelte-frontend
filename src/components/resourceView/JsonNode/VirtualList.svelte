<script lang="ts" context="module">
  type Path = (number | string | null)[];
  const compare = (path: Path, other: Path) => {
    if (path.length !== other.length) return false;
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== other[i]) return false;
    }
    return true;
  };
</script>

<script lang="ts">
  import type { JSONResource, NodeAndType } from "./tree";

  import { virtualize } from "./virtualList";

  export let jsonResource: JSONResource;
  export let maxHeight: number;
  export let defaultItemHeight = 24;

  let topOffset = 0;
  let bottomOffset = 0;
  let items: NodeAndType[] = [];
  const onVirtualize = ({ detail }) => {
    bottomOffset = detail.bottomOffset;
    topOffset = detail.topOffset;
    items = jsonResource.slice(detail.startIndex, detail.endIndex + 1);
  };
</script>

<style>
  virtual-list,
  virtual-list-inner {
    display: block;
  }
</style>

<virtual-list
  on:loadPage
  use:virtualize={{ jsonResource, maxHeight, averageHeight: defaultItemHeight }}
  on:virtualize={onVirtualize}
  style="height: {maxHeight}px"
  class="overflow-y-auto scroll">
  <virtual-list-inner
    style="padding-bottom: {bottomOffset}px; padding-top: {topOffset}px">
    {#each items as row, index}
      <virtual-list-item>
        <slot item={row} />
      </virtual-list-item>
    {/each}
  </virtual-list-inner>
</virtual-list>
