<script lang="ts">
  import { NodeType } from "sirixdb";
  import { tooltip } from "renderless-svelte";
  import type { ExtendedMetaNode } from "./tree";
  import { expandAndFade } from "utils/transition";

  export let node: ExtendedMetaNode;

  // to silence svelte from raising issues with props
  export let diff = undefined;
  export let hover = undefined;
  export let jsonResource;
  export let path: (string | number | null)[];
  //@ts-ignore
  jsonResource, hover, diff;

  let nodeType: NodeType, textColor: string;
  $: {
    nodeType = node.metadata.type;
    textColor =
      nodeType === NodeType.STRING_VALUE ||
      nodeType === NodeType.OBJECT_STRING_VALUE ||
      nodeType === NodeType.OBJECT_KEY
        ? "text-yellow-900"
        : nodeType === NodeType.NUMBER_VALUE ||
          nodeType === NodeType.OBJECT_NUMBER_VALUE
        ? "text-green-600"
        : // NULL or BOOLEAN
          "text-indigo-600";
  }
  let index: string | number;
  $: {
    index = path[path.length - 1];
  }
  let display: string, truncate: boolean;
  $: {
    display = String(node.value);
    truncate = display.length > 60;
    if (truncate) {
      display = display.slice(0, 60);
    }
  }
</script>

<style>
  span {
    display: inline-block;
    width: 100%;
  }
</style>

<span class={textColor} use:tooltip={truncate ? { text: node.value } : false}>
  {#if typeof index === 'number'}{index}:{/if}
  {node.metadata.type.endsWith('STRING_VALUE') ? `"${display}"` : display}{truncate ? '...' : ''}
</span>
<br />
