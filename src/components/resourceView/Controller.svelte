<script lang="ts">
  import { sirix } from "../../sirix";

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
  let diff: number;
  let oldSelection = {
    dbName: null,
    dbType: null,
    resourceName: null,
    revision: null,
    diff: null
  };

  $: {
    let sel = $selected;
    ({ dbName, dbType, resourceName, revision, diff } = sel);
    for (let key in oldSelection) {
      if (sel[key] !== oldSelection[key]) {
        if (key !== "diff") {
          emptyRevision();
        }
      }
    oldSelection = sel;
    }
  }

  $: {
    $refreshResource;
    emptyRevision();
    if (resourceName !== null && revision) {
      loadRevision(dbName, dbType, resourceName, revision);
    }
  }

  import JsonController from "./JsonController.svelte";
</script>

{#if jsonResource !== null}
  <JsonController
    node={jsonResource}
    {dbName}
    {dbType}
    {resourceName}
    {revision}
    {diff} />
{/if}
