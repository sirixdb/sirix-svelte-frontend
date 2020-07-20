<script>
  import { NodeType } from "sirixdb"; 
  import { valueFuncReg } from "./functions";

  export let props;
  export let index = undefined;

  // to silence svelte from raising issues with props
  export let expanded = undefined;
  export let hover = undefined;
  expanded, hover;

  let nodeType, value, diff, textColor;
  $: {
    ({ nodeType, value, diff } = props);
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

  import { diffView } from "../../../store";

  // transformations
  import { expandAndFade } from "../../../utils/transition.js";
</script>

{#if index !== undefined && !$diffView}
  <span>{index}:</span>
{/if}

<span class={textColor} transition:expandAndFade|local>
  {nodeType.endsWith('STRING_VALUE') ? `"${value}"` : value}
</span>

{#if diff}
  <svelte:component
    this={diff.component}
    props={{ diffNode: diff.diffNode, nextDiff: diff.props }} />
{/if}
