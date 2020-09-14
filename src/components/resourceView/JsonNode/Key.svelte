<script lang="ts">
  import Wrapper from "./Wrapper.svelte";
  import Arrow from "../../icons/Arrow.svelte";
  import { NodeType } from "sirixdb";
  import { refreshDisplay } from "./store.js";
  import type { JSONResource, ExtendedMetaNode } from "./tree";
  import { createEventDispatcher } from "svelte";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];
  export let node: ExtendedMetaNode;
  // silence the compiler and runtime warnings
  export let index = undefined;
  index;

  let self: HTMLElement;
  let childComponent;

  let hover = false;
  let expanded = false;
  const toggleExpansion = () => {
    childComponent.toggleExpansion && childComponent.toggleExpansion();
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
    node.metadata.childCount !== Object.keys(child.value).length
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

<Wrapper
  {jsonResource}
  let:component
  let:node
  let:path={childPath}
  path={path.concat(null)}>
  <svelte:component
    this={component}
    bind:this={childComponent}
    path={childPath}
    on:loadDeeper
    {hover}
    {node}
    {jsonResource} />
</Wrapper>
