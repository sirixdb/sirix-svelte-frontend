<script lang="ts">
  import VirtualList from "../../componentLibrary/VirtualList.svelte";
  import Wrapper from "./Wrapper.svelte";
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { createEventDispatcher, tick } from "svelte";
  import { refreshDisplay } from "./store.js";
  import type { JSONResource, ExtendedMetaNode, JSONDiffs } from "./tree";
  // transformations
  import { expandAndFade } from "../../../utils/transition.js";

  export let jsonResource: JSONResource;
  export let jsonDiffs: JSONDiffs;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  export let hover = false;
  export let index = null;
  export let diff = undefined;

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

  const dispatch = createEventDispatcher();
  $: if (hover && node.metadata.childCount !== Object.keys(node.value).length) {
    dispatch("loadDeeper", {
      path,
      nodeKey: node.metadata.nodeKey,
      insertKey: null,
    });
  }

  //@ts-ignore
  let maxHeight = document.querySelector("#resource-view").offsetHeight - 30;
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

{#if diff && diff.type === 'insertAsFirstChild'}
  <json-diff-wrapper
    class="pl-4 block"
    style="background-color: rgba(0, 255, 0, 0.4);">
    <svelte:component this={diff.component} props={diff.data} />
  </json-diff-wrapper>
{/if}

{#if node.expanded && node.metadata.childCount !== 0}
  <VirtualList {maxHeight} items={node.value} let:index>
    <div
      transition:expandAndFade|local={{ duration: node.transition ? 300 : 0 }}
      on:mouseover|stopPropagation={() => (hover = true)}
      on:mouseout|stopPropagation={() => (hover = false)}
      class="pl-4">
      <Wrapper
        {jsonDiffs}
        {jsonResource}
        path={path.concat(node.metadata.type === NodeType.ARRAY ? index : node.value[index].key)}
        let:component
        let:node={childNode}
        let:diff
        let:path>
        <svelte:component
          this={component}
          on:loadDeeper
          node={childNode}
          {diff}
          {path}
          {jsonDiffs}
          {index}
          {jsonResource} />
      </Wrapper>
    </div>
  </VirtualList>
{/if}
