<script lang="ts">
  export let node;
  export let dbName, dbType;
  export let resourceName: string;
  export let revision: number;
  export let diff: number;

  import Wrapper from "./JsonNode/Wrapper.svelte";

  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import { settingsStore } from "../../lib/db_stores";
  import type { MetaNode } from "sirixdb";
  import { selected } from "../../store";
  import { JSONResource, JSONDiffs } from "./JsonNode/tree";
  import VirtualList from "./JsonNode/VirtualList.svelte";

  let jsonResource: JSONResource;
  let jsonDiffs: JSONDiffs = null;
  $: {
    jsonResource = new JSONResource(node);
    jsonResource.setProperty([], "expanded", true);
  }

  if (diff) {
    if (diff < revision) {
      selected.update((old) => ({ ...old, revision: diff, diff: revision }));
    }
    sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName)
      .diff(revision, diff, {
        maxLevel: $settingsStore["lazy-loading"].initialDepth,
      })
      .then((diffResponse) => {
        console.log(diffResponse);
        jsonDiffs = new JSONDiffs(diffResponse);
      });
  }

  const onLoadPage = ({ detail }) => {
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource
      .readWithMetadata({
        nodeId: detail.nodeKey,
        revision,
        maxLevel: $settingsStore["lazy-loading"].lazyLoadDepth,
        nextTopLevelNodes: $settingsStore["pagination-size"],
        lastTopLevelNodeKey: detail.lastNode,
      })
      .then((newNode) => {
        jsonResource.inject(
          [],
          newNode.value as MetaNode | MetaNode[],
          detail.insertKey
        );
      });
  };

  const loadDeeper = ({ detail }) => {
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource
      .readWithMetadata({
        nodeId: detail.nodeKey,
        revision,
        maxLevel: $settingsStore["lazy-loading"].lazyLoadDepth,
      })
      .then((newNode) => {
        jsonResource.inject(
          detail.path,
          newNode.value as MetaNode | MetaNode[],
          detail.insertKey
        );
      });
    if (diff) {
      resource
        .diff(revision, diff, {
          nodeId: detail.nodeKey,
          maxLevel: $settingsStore["lazy-loading"].lazyLoadDepth,
        })
        .then((diffResponse) => {
          jsonDiffs.add(diffResponse.diffs);
        });
    }
  };

  //@ts-ignore
  const maxHeight = document.querySelector("#resource-view").offsetHeight - 30;
</script>

<VirtualList {jsonResource} {maxHeight} let:item={currentNode}>
  <Wrapper
    on:loadPage={onLoadPage}
    {jsonDiffs}
    currentNode={currentNode[0]}
    path={currentNode[1]}
    let:component
    let:node>
    <svelte:component
      this={component}
      path={currentNode[1]}
      {node}
      on:loadDeeper={loadDeeper}
      {jsonResource} />
  </Wrapper>
</VirtualList>
