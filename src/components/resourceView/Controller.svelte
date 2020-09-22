<script lang="ts">
  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import { Tooltip } from "renderless-svelte";
  import { selected, refreshResource } from "../../store.js";
  import { settingsStore } from "../../lib/db_stores";

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
      .readWithMetadata({
        revision,
        maxLevel: $settingsStore["lazy-loading"].initialDepth,
        nextTopLevelNodes: $settingsStore["pagination-size"],
      })
      .then((nodes) => {
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

<style>
  .tooltip {
    transform: translateX(-50%);
  }
  .tooltip:before {
    border-style: solid;
    border-width: 5px 5px 0 6px;
    border-color: gray transparent transparent transparent;
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    bottom: -5px;
  }
</style>

{#if jsonResource !== null}
  <JsonController
    node={jsonResource}
    {dbName}
    {dbType}
    {resourceName}
    {revision}
    {diff} />
{/if}

<Tooltip let:options let:dimensions>
  {#if options}
    <div
      class="tooltip bg-gray-100 rounded-md text-gray-900 fixed py-1 px-2"
      style="left: {dimensions.x + dimensions.width / 2}px; bottom: calc(100vh - {dimensions.y}px);">
      <span>{options.text}</span>
    </div>
  {/if}
</Tooltip>
