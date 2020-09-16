<script lang="ts">
  export let node;
  export let dbName, dbType;
  export let resourceName: string;
  export let revision: number;
  export let diff: number;

  import Wrapper from "./JsonNode/Wrapper.svelte";

  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import type { MetaNode } from "sirixdb";
  import { selected } from "../../store";
  import { JSONResource, JSONDiffs } from "./JsonNode/tree";

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
      .diff(revision, diff, { maxLevel: 4 })
      .then((diffResponse) => {
        console.log(diffResponse);
        jsonDiffs = new JSONDiffs(diffResponse);
      });
  }

  const loadDeeper = ({ detail }) => {
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource
      .readWithMetadata({ nodeId: detail.nodeKey, revision, maxLevel: 3 })
      .then((newNode) => {
        jsonResource.inject(
          detail.path,
          newNode.value as MetaNode | MetaNode[],
          detail.insertKey
        );
      });
    if (diff) {
      resource
        .diff(revision, diff, { nodeId: detail.nodeKey, maxLevel: 3 })
        .then((diffResponse) => {
          jsonDiffs.add(diffResponse.diffs);
        });
    }
  };
</script>

<Wrapper
  {jsonResource}
  {jsonDiffs}
  path={[]}
  let:path
  let:diff
  let:component
  let:node>
  <svelte:component
    this={component}
    {diff}
    {path}
    {node}
    on:loadDeeper={loadDeeper}
    {jsonDiffs}
    {jsonResource} />
</Wrapper>
