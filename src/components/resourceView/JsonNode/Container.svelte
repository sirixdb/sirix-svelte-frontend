<script lang="ts">
  import Wrapper from "./Wrapper.svelte";
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { createEventDispatcher, tick } from "svelte";
  import { refreshDisplay } from "./store";
  import type { JSONResource, ExtendedMetaNode } from "./tree";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  export let hover = false;
  export let index: number = null;
  export let diff = undefined;

  const toggleExpansion = () => {
    jsonResource.toggleProperty(path, "expanded");
    refreshDisplay.refresh();
  };

  const dispatch = createEventDispatcher();
  $: if (hover && node.metadata.childCount !== Object.keys(node.value).length) {
    dispatch("loadDeeper", {
      path,
      nodeKey: node.metadata.nodeKey,
      insertKey: null,
    });
  }
</script>

<span
  style={path[path.length - 1] !== null ? `margin-left: ${path.filter((val) => val !== null).length}rem` : ''}
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

<br />

{#if diff && diff.type === 'insertAsFirstChild'}
  <json-diff-wrapper
    class="pl-4 block"
    style="background-color: rgba(0, 255, 0, 0.4);">
    <svelte:component this={diff.component} props={diff.data} />
  </json-diff-wrapper>
{/if}
