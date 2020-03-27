<script lang="ts">
  import { NodeType } from "sirix/src/info";
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
  export let node: MetaNode;
  export let index = undefined;
  export let treeNode, path, expanded, hover;
  // the following line will stop the compiler from
  // complaining that we aren't using these variables
  treeNode, path, expanded, hover;

  let nodeType = node.metadata.type;
  let textColor =
    nodeType === NodeType.STRING_VALUE ||
    nodeType === NodeType.OBJECT_STRING_VALUE ||
    nodeType === NodeType.OBJECT_KEY
      ? "text-orange-900"
      : nodeType === NodeType.NUMBER_VALUE ||
        nodeType === NodeType.OBJECT_NUMBER_VALUE
      ? "text-green-600"
      : // NULL or BOOLEAN
        "text-indigo-600";

  // transformations
  import { expandAndFade } from "../../../utils/transition";
</script>

{#if index !== undefined}
  <span>{index}:</span>
{/if}

<span class={textColor} transition:expandAndFade|local>
  {nodeType.endsWith('STRING_VALUE') ? `"${node.value}"` : node.value}
</span>
