<script>
  export let data;
  let revisionNumber, revisionTimestamp, body;
  $: {
    revisionNumber = data.revisionNumber;
    revisionTimestamp = data.revisionTimestamp;
    if (revisionNumber && revisionTimestamp) {
      body = data.revision;
    } else {
      body = data;
    }
  }
</script>

{#if revisionNumber !== undefined && revisionTimestamp !== undefined}
  <div><i>Revision:</i> {revisionNumber}</div>
  <div><i>Timestamp:</i> {revisionTimestamp}</div>
{/if}

{JSON.stringify(body)}
