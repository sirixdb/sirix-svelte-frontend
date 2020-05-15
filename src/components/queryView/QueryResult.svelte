<script>
  import { onMount, setContext } from "svelte";
  export let data;
  export let index;
  let height;
  let revisionNumber, revisionTimestamp, body, isContainer;
  $: {
    revisionNumber = data.revisionNumber;
    revisionTimestamp = data.revisionTimestamp;
    if (revisionNumber && revisionTimestamp) {
      body = data.revision;
    } else {
      body = data;
    }
    if (typeof body === "object" && body !== null) {
      isContainer = true;
    } else {
      isContainer = false;
    }
  }
  import { subTreeStore } from "./store.js";
  import { syntaxHighlight } from "lib/json_utils.js";
  $: subTree =
    $subTreeStore && $subTreeStore[index] !== undefined
      ? syntaxHighlight($subTreeStore[index])
      : "";

  setContext("resultIndex", index);

  import { Container, Value } from "./jsonNode/nodes.js";
</script>

{#if revisionNumber !== undefined && revisionTimestamp !== undefined}
  <div>
    <i>Revision:</i>
    {revisionNumber}
  </div>
  <div>
    <i>Timestamp:</i>
    {revisionTimestamp}
  </div>
{/if}

<section class="flex">
  <div class="w-1/2">
    <div bind:clientHeight={height} class="px-2">
      {#if isContainer}
        <Container depth={0} data={body} />
      {:else}
        <Value depth={0} value={body} />
      {/if}
    </div>
    <br />
  </div>
  <div
    style="height: {height}px;"
    class="w-1/2 border-solid border-gray-500 rounded-sm overflow-y-scroll scroll">
    <pre class="text-sm my-0">
      {@html subTree}
    </pre>
  </div>
</section>
