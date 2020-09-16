<script lang="ts">
  export let props;

  let textColor: string;
  let dataType: string;

  $: {
    dataType = typeof props.child;
    textColor =
      dataType === "number"
        ? "text-green-600"
        : dataType === "string"
        ? "text-orange-900"
        : "text-indigo-600";
  }
</script>

<span class={textColor}>
  {#if dataType === 'string'}"{props.data}"{:else}{props.data}{/if}
</span>
