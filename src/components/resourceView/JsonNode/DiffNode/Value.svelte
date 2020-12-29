<script lang="ts">
  export let props;

  let textColor: string;
  let dataType: string;
  let text;

  $: {
    text = typeof props === "string" ? props : props.data;
    dataType = typeof text;
    textColor =
      dataType === "number"
        ? "text-green-600"
        : dataType === "string"
        ? "text-orange-900"
        : "text-indigo-600";
  }
</script>

<span class={textColor}>
  {#if dataType === 'string'}"{text}"{:else}{text}{/if}
</span>
