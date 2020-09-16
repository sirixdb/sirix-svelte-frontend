<script>
  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import { selected, refreshResource } from "../../store.js";

  import { tick } from "svelte";

  let jsonResource = null;

  const emptyRevision = async () => {
    jsonResource = null;
    await tick();
  };

  const loadRevision = (dbName, dbType, resourceName, revision) => {
    sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName)
      .readWithMetadata({ revision, maxLevel: 4 }).then((nodes) => {
      jsonResource = nodes;
    });
  };

  let dbName, dbType, resourceName, revision, diff;
  let oldSelection = {
    dbName: null,
    dbType: null,
    resourceName: null,
    revision: null,
    diff: null,
  };

  const newSelection = async (sel) => {
    ({ dbName, dbType, resourceName, revision, diff } = sel);
    for (let key in oldSelection) {
      if (sel[key] !== oldSelection[key]) {
        if (key !== "diff") {
          await emptyRevision();
        }
      }
    }
    oldSelection = sel;
    await emptyRevision();
    if (resourceName !== null && revision) {
      loadRevision(dbName, dbType, resourceName, revision);
    }
  };
  const refresh = async () => {
    await emptyRevision();
    if (resourceName !== null && revision) {
      loadRevision(dbName, dbType, resourceName, revision);
    }
  };

  $: newSelection($selected);
  $: $refreshResource, refresh();

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
