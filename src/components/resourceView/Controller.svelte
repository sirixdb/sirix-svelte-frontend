<script lang="ts">
  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { selected, jsonResource } from "../../store";

  const emptyRevision = () => {
    jsonResource.set(null);
  };

  const loadRevision = (
    dbName: string,
    dbType: string,
    resourceName: string,
    revision: number
  ) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .readWithMetadata({ revision })
        .then(nodes => {
          jsonResource.set(nodes);
        });
    });
  };

  let dbName: string;
  let dbType: string;
  let resourceName: string;
  const unsubscribe = selected.subscribe(sel => {
    let { dbName, dbType, resourceName, revision } = sel;
    if (resourceName && revision) {
      loadRevision(dbName, dbType, resourceName, revision);
    } else if (resourceName === null) {
      emptyRevision();
    }
  });
  onDestroy(unsubscribe);

  import JsonNode from "./JsonNode.svelte";
</script>

{#if $jsonResource !== null}
  <JsonNode node={$jsonResource} />
{/if}
