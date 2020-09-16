<script lang="ts">
  import { NodeType } from "sirixdb";
  import type { JSONResource, ExtendedMetaNode } from "./tree";

  export let node: ExtendedMetaNode;

  export let index: number = undefined;

  // to silence svelte from raising issues with props
  export let diff = undefined;
  export let hover = undefined;
  export let jsonResource: JSONResource;
  export let jsonDiffs;
  export let path: (string | number | null)[];
  //@ts-ignore
  jsonResource, jsonDiffs, path, hover, diff;

  let nodeType: NodeType, textColor: string;
  $: {
    nodeType = node.metadata.type;
    textColor =
      nodeType === NodeType.STRING_VALUE ||
      nodeType === NodeType.OBJECT_STRING_VALUE ||
      nodeType === NodeType.OBJECT_KEY
        ? "text-orange-900"
        : nodeType === NodeType.NUMBER_VALUE ||
          nodeType === NodeType.OBJECT_NUMBER_VALUE
        ? "text-green-600"
        : // NULL or BOOLEAN
          "text-indigo-600";
  }
</script>

{#if index !== undefined}<span>{index}:</span>{/if}

<span class={textColor}>
  {nodeType.endsWith('STRING_VALUE') ? `"${node.value}"` : node.value}
</span>
