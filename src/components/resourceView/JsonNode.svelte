<script lang="ts">
  import { NodeType } from "sirix/src/info";

  // the preprocessor doesn't allow for importing interfaces, so here are the interfaces
  interface Metadata {
    nodeKey: number;
    hash: number;
    type: NodeType;
    descendantCount?: number; // only for type "OBJECT" and "ARRAY"
    childCount?: number; // only for type "OBJECT" and "ARRAY"
  }
  interface MetaNode {
    metadata: Metadata;
    key?: string; // if metadata.type === "OBJECT_KEY"
    value:
      | Node[] // if metadata.type === "OBJECT" or "ARRAY" alternatively
      | {} // if can be an empty object, if metadata.childCount === 0
      | [] // or an empty array, depending on whether type is "OBJECT" or "ARRAY"
      | Node // if metadata.type === "OBJECT_KEY"
      | string // if metadata.type === "OBJECT_STRING_VALUE" or "STRING_VALUE"
      | number // if metadata.type === "OBJECT_NUMBER_VALUE" or "NUMBER_VALUE"
      | boolean // if metadata.type === "OBJECT_BOOLEAN_VALUE" or "BOOLEAN_VALUE"
      | null; // if metadata.type === "OBJECT_NULL_VALUE" or "NULL_VALUE"
  }

  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { jsonResource } from "../../store";

  // the current node
  export let node: MetaNode = undefined;
  // index, assuming we are inside an array
  export let index: number = undefined;
  // path through the json file to get to the parent node
  export let parentPath: string[] = [];
  // whether to expand and show
  export let expanded = false;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  if (node === undefined) {
    const unsubscribe = jsonResource.subscribe(metaNode => {
      node = metaNode;
    });
    onDestroy(unsubscribe);
  }

  let nodeType: NodeType;
  let childNodes: MetaNode[];
  let childNode: MetaNode;
  let primitive: boolean;
  let key: number | string | null;
  let textColor: string;
  $: {
    nodeType = node !== undefined ? node.metadata.type : undefined;
    primitive = nodeType !== NodeType.OBJECT && nodeType !== NodeType.ARRAY;
    if (!primitive) {
      childNodes = node.value as MetaNode[];
    } else if (nodeType === NodeType.OBJECT_KEY) {
      childNode = node.value as MetaNode;
    }
    // get the key for reaching the current node from the parent node
    // if the current node is an OBJECT_KEY, then the key attribute is the key
    key =
      nodeType === NodeType.OBJECT_KEY
        ? node.key
        : // if we are inside an object, but the current node is a value node,
        // then use null as the key for reaching the current node from the
        // parent OBJECT_KEY node
        nodeType.startsWith("OBJECT_") && !nodeType.endsWith("KEY")
        ? null
        : // we are inside an array, so the index is the key
          index;

    textColor =
      nodeType === NodeType.STRING_VALUE ||
      nodeType === NodeType.OBJECT_STRING_VALUE ||
      nodeType === NodeType.OBJECT_KEY
        ? "text-orange-900"
        : nodeType === NodeType.NUMBER_VALUE ||
          nodeType === NodeType.OBJECT_NUMBER_VALUE
        ? "text-green-600"
        : nodeType === NodeType.NULL_VALUE ||
          nodeType === NodeType.OBJECT_NULL_VALUE ||
          nodeType === NodeType.BOOLEAN_VALUE ||
          nodeType === NodeType.OBJECT_BOOLEAN_VALUE
        ? "text-indigo-600"
        : // OBJECT or ARRAY
          "text-purple-800";
  }

  import { expandAndFade } from "../../utils/transition";
</script>

{#if key !== null && key !== undefined}
  <!-- we are inside an array, or this is an OBJECT_KEY node -->
  <span>{key}:</span>
  {#if childNode}
    <span
      class="hover:bg-gray-300"
      on:click|stopPropagation={toggleExpansion}
      transition:expandAndFade>
      <svelte:self node={childNode} parentPath={parentPath.concat(key)} />
    </span>
  {/if}
{/if}

{#if primitive && nodeType.startsWith('OBJECT') && nodeType !== NodeType.OBJECT_KEY}
  <!-- this is an OBJECT VALUE node -->
  <span class={textColor} transition:expandAndFade>
    {nodeType.endsWith('STRING_VALUE') ? `"${node.value}"` : node.value}
  </span>
{/if}

{#if primitive && !nodeType.startsWith('OBJECT')}
  <!-- this is an array VALUE node -->
  <span class={textColor} transition:expandAndFade>
    {nodeType.endsWith('STRING_VALUE') ? `"${node.value}"` : node.value}
  </span>
{/if}

{#if !primitive}
  {#if nodeType === NodeType.ARRAY}
    <span on:click|stopPropagation={toggleExpansion}>
      [{node.metadata.childCount}]
    </span>
  {:else}
    <span on:click|stopPropagation={toggleExpansion}>
      {'{' + node.metadata.childCount + '}'}
    </span>
  {/if}
{/if}

{#if !primitive && expanded}
  <div class="pl-4 hover:bg-gray-300" transition:expandAndFade>
    {#each childNodes as n, index (n.metadata.nodeKey)}
      <div>
        <svelte:self node={n} {index} parentPath={parentPath.concat(key)} />
      </div>
    {/each}
  </div>
{/if}
