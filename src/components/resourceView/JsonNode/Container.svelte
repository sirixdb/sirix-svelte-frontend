<script lang="ts">
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { createEventDispatcher, getContext } from "svelte";
  import { refreshDisplay } from "./store";
  import type { JSONResource, ExtendedMetaNode } from "./tree";
  import { expandAndFade } from "utils/transition";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  export let hover = false;
  let index: string | number;
  let margin = 0;
  $: {
    if (path.length === 0) index = null;
    else index = path[path.length - 1];

    margin = path.filter((val) => val !== null).length
  }

  const toggleExpansion = () => {
    jsonResource.toggleProperty(path, "expanded");
    refreshDisplay.refresh();
  };

  const dispatch = createEventDispatcher();
  $: if (
    hover &&
    node.metadata.childCount !== 0 &&
    Object.keys(node.value).length === 0
  ) {
    dispatch("loadDeeper", {
      path,
      nodeKey: node.metadata.nodeKey,
      insertKey: null,
    });
  }

</script>

<style>
  span {
    display: inline-block;
    width: 100%;
  }
</style>

<span
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
