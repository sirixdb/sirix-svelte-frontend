<script lang="ts">
  export let child: string;
  //silence the compiler
  export let data = undefined;
  data;

  let textColor: string;

  $: {
    textColor =
      typeof child === "number"
        ? "text-green-600"
        : typeof child === "string"
        ? "text-orange-900"
        : "text-indigo-600";
  }
</script>

<span class={textColor}>"{child}"</span>
