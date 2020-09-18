<script lang="ts">
  import { NodeType } from "sirixdb";
  import type { ExtendedMetaNode } from "./tree";

  export let node: ExtendedMetaNode;

  // to silence svelte from raising issues with props
  export let diff = undefined;
  export let hover = undefined;
  export let jsonResource;
  export let path: (string | number | null)[];
  //@ts-ignore
  jsonResource, path, hover, diff;

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
  $: index = path[path.length - 1];
  $: style = `margin-left: ${path.filter((val) => val !== null).length}rem`;
</script>

{#if typeof index === 'number'}<span {style}>{index}:</span>{/if}

<span class={textColor}>
  {nodeType.endsWith('STRING_VALUE') ? `"${node.value.slice(0, 60)}"` : node.value}
</span>
<br />
