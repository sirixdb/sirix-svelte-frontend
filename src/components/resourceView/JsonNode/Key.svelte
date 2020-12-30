<script lang="ts">
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { refreshDisplay } from "./store";
  import type { JSONResource, ExtendedMetaNode } from "./tree";
  import { createEventDispatcher, tick } from "svelte";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;

  let hover = false;
  let expanded = false;

  const toggleExpansion = () => {
    jsonResource.toggleProperty(path.concat(null), "expanded");
    refreshDisplay.refresh();
  };

  let child: ExtendedMetaNode;
  let childIsContainer: boolean;
  $: $refreshDisplay, (expanded = child.expanded);
  $: {
    child = node.value as ExtendedMetaNode;
    childIsContainer =
      child.metadata.type === NodeType.OBJECT ||
      child.metadata.type === NodeType.ARRAY;
  }

  const dispatch = createEventDispatcher();
  $: if (
    hover &&
    childIsContainer &&
    child.metadata.childCount !== Object.keys(child.value).length
  ) {
    dispatch("loadDeeper", {
      path: path.concat(null),
      nodeKey: child.metadata.nodeKey,
      insertKey: null,
    });
  }
</script>

<span
  on:mouseover={() => (hover = true)}
  on:mouseout={() => (hover = false)}
  on:click|stopPropagation={toggleExpansion}>
  {#if childIsContainer}
    <Arrow {expanded} />
  {/if}
  {node.key}:
</span>
