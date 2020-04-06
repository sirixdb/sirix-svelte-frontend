<script>
  import { NodeType } from "sirix/src/info";

  export let props;
  export let index = undefined;
  
  // to silence svelte from raising issues with props
  export let expanded = undefined;
  export let hover = undefined;
  expanded, hover;

  let nodeType = props.node.metadata.type;
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
  import { expandAndFade } from "../../../utils/transition.js";

  $: console.log(props)
</script>

{#if index !== undefined}
  <span>{index}:</span>
{/if}

<span class={textColor} transition:expandAndFade|local>
  {nodeType.endsWith('STRING_VALUE') ? `"${props.node.value}"` : props.node.value}
</span>

{#if props.diff}
  <svelte:component this={props.diff.component} props={{diffNode: props.diff.diffNode}} />
{/if}
