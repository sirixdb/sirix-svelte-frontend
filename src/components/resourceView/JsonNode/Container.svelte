<script lang="ts">
  import VirtualList from "../../componentLibrary/VirtualList.svelte";
  import Wrapper from "./Wrapper.svelte";
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { createEventDispatcher, tick } from "svelte";
  import { refreshDisplay } from "./store.js";
  import type { JSONResource, ExtendedMetaNode } from "./tree";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  //@ts-ignore
  let maxHeight = document.querySelector("#resource-view").offsetHeight - 30;

  export let hover = false;
  export let index = null;

  $: $refreshDisplay, (node.expanded = node.expanded);

  let self: HTMLElement;
  export const toggleExpansion = async () => {
    node.transition = true;
    node.expanded = !node.expanded;
    await tick();
    refreshDisplay.refresh();
    setTimeout(
      () =>
        self.dispatchEvent(new CustomEvent("revirtualize", { bubbles: true })),
      250
    );
    await tick();
    node.transition = false;
  };

  let items: ExtendedMetaNode[];
  $: items = node.value as ExtendedMetaNode[];

  const dispatch = createEventDispatcher();
  $: if (hover && node.metadata.childCount !== Object.keys(items).length) {
    dispatch("loadDeeper", {
      path,
      nodeKey: node.metadata.nodeKey,
      insertKey: null,
    });
  }
</script>

<style>
  * {
    contain: style;
  }
</style>

<span
  bind:this={self}
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if path[path.length - 1] !== null}
    <Arrow expanded={node.expanded} />
  {/if}
  {#if index !== null}{index}:{/if}
  {#if node.metadata.type === NodeType.ARRAY}
    <i>array</i>
    {`[${node.metadata.childCount}]`}
  {:else}<i>object</i> {`{${node.metadata.childCount}}`}{/if}
</span>

{#if node.expanded && node.metadata.childCount !== 0}
  <VirtualList {maxHeight} {items} let:index>
    <div
      transition:expandAndFade={{ duration: node.transition ? 300 : 0 }}
      on:mouseover|stopPropagation={() => (hover = true)}
      on:mouseout|stopPropagation={() => (hover = false)}
      class="pl-4">
      <Wrapper
        {jsonResource}
        let:component
        let:node={childNode}
        let:path
        path={path.concat(node.metadata.type === NodeType.ARRAY ? index : node.value[index].key)}>
        <svelte:component
          this={component}
          on:loadDeeper
          node={childNode}
          {path}
          {index}
          {jsonResource} />
      </Wrapper>
    </div>
  </VirtualList>
{/if}
