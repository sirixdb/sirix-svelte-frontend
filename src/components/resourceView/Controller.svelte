<script>
  import { sirix } from "../../sirix";

  import { selected, refreshResource } from "../../store";

  let jsonResource = null;

  const emptyRevision = () => {
    jsonResource = null;
  };

  const loadRevision = (dbName, dbType, resourceName, revision) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .readWithMetadata({ revision, maxLevel: 4 })
        .then(nodes => {
          jsonResource = nodes;
        });
    });
  };

  let dbName, dbType, resourceName, revision, diff;
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
