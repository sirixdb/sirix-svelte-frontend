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
  let animationMap = [];
  const onVirtualize = ({ detail }) => {
    bottomOffset = detail.bottomOffset;
    topOffset = detail.topOffset;
    const oldItems = items.map((item) => item[1]);
    items = jsonResource.slice(detail.startIndex, detail.endIndex + 1);

    animationMap = [];
    items.forEach((item, index) => {
      const found = oldItems.findIndex(old => compare(item[1], old));
      if (found === -1) {
        animationMap[index] = true;
      }
    });
  };
</script>

<style>
  virtual-list,
  virtual-list-inner {
    display: block;
  }
  @keyframes -global-expandAndFadeOut {
    from {
      opacity: 1;
      line-height: 1;
    }

    to {
      line-height: 0;
      opacity: 0;
    }
  }

  @keyframes -global-expandAndFadeIn {
    from {
      opacity: 0;
      line-height: 0;
    }

    to {
      line-height: 1;
      opacity: 1;
    }
  }

  .animate {
    animation: expandAndFadeIn 300ms;
  }

  virtual-list-item {
    vertical-align: top;
  }
</style>

<virtual-list
  use:virtualize={{ jsonResource, maxHeight, averageHeight: defaultItemHeight }}
  on:virtualize={onVirtualize}
  style="height: {maxHeight}px"
  class="overflow-y-auto scroll">
  <virtual-list-inner
    style="padding-bottom: {bottomOffset}px; padding-top: {topOffset}px">
    {#each items as row, index}
      <virtual-list-item class:animate={animationMap[index]}>
        <slot item={row} />
      </virtual-list-item>
    {/each}
  </virtual-list-inner>
</virtual-list>
