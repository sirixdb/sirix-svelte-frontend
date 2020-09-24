<script lang="ts">
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { createEventDispatcher } from "svelte";
  import { refreshDisplay } from "./store";
  import type { JSONResource, ExtendedMetaNode } from "./tree";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  export let hover = false;
  export let index: number = null;

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
