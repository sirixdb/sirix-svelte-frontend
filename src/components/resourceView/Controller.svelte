<script lang="ts">
  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { selected, refreshResource } from "../../store";

  let jsonResource = null;

  const emptyRevision = () => {
    jsonResource = null;
  };

  const loadRevision = (
    dbName: string,
    dbType: string,
    resourceName: string,
    revision: number
  ) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .readWithMetadata({ revision, maxLevel: 4 })
        .then(nodes => {
          jsonResource = nodes;
        });
    });
  };

  let dbName: string;
  let dbType: string;
  let resourceName: string;
  let revision: number;
  let oldSelection = {
    dbName: null,
    dbType: null,
    resourceName: null,
    revision: null
  };
  const unsubscribe1 = selected.subscribe(sel => {
    ({ dbName, dbType, resourceName, revision } = sel);
    if (resourceName === null || !revision) {
      emptyRevision();
    }
    for (let key in oldSelection) {
      if (sel[key] !== oldSelection[key]) {
        emptyRevision()
      }
    }
  });
  const unsubscribe2 = refreshResource.subscribe(() => {
    if (resourceName !== null && revision) {
      emptyRevision();
      loadRevision(dbName, dbType, resourceName, revision);
    }
  });
  onDestroy(unsubscribe1);
  onDestroy(unsubscribe2);

  import JsonController from "./JsonController.svelte";
</script>

{#if jsonResource !== null}
  <JsonController node={jsonResource} {dbName} {dbType} {resourceName} {revision} />
{/if}
