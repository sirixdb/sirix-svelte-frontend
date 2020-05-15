<script>
  export let data;
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

{#if isContainer}
  <Container depth={0} data={body} />
{:else}
  <Value depth={0} value={body} />
{/if}
