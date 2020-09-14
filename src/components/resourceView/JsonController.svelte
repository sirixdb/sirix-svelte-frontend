<script lang="ts">
  export let node;
  export let dbName, dbType;
  export let resourceName;
  export let revision;
  export let diff;

  import Wrapper from "./JsonNode/Wrapper.svelte";

//  import { createTree, loadDiffs, inject, injectDiffs } from "./buildTree";
  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import type { MetaNode } from "sirixdb";
  import { selected } from "../../store";
  import { JSONResource } from "./JsonNode/tree";

//  let treeNode = createTree(node, []);
  let jsonResource: JSONResource;
  $: {
    jsonResource = new JSONResource(node);
    jsonResource.setProperty([], "expanded", true);
  }
  /*const loadDeeper = ({ detail }) => {
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource
      .readWithMetadata({ nodeId: detail.key, revision, maxLevel: 3 })
      .then((newNode) => {
        const toInsert = newNode.value.map((obj, index) =>
          createTree(obj, detail.path, index)
        );
        if (diff) {
          loadDiffs(revision, diff, dbName, dbType, resourceName, {
            maxLevel: 4,
          }).then((diffs) => {
            treeNode = injectDiffs(
              inject(treeNode, toInsert, detail.path, detail.insertKey),
              diffs
            );
          });
        } else {
          treeNode = inject(treeNode, toInsert, detail.path, detail.insertKey);
        }
      });
  };*/

  const loadDeeper = ({ detail }) => {
    const resource = sirix
      .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
      .resource(resourceName);
    resource
      .readWithMetadata({ nodeId: detail.nodeKey, revision, maxLevel: 3 })
      .then((newNode) => {
        jsonResource.inject(detail.path, newNode.value as MetaNode | MetaNode[], detail.insertKey);
      });
  };

/*  if (diff && diff !== revision) {
    if (diff < revision) {
      selected.update((old) => ({ ...old, revision: diff, diff: revision }));
    }
    loadDiffs(revision, diff, dbName, dbType, resourceName, {
      maxLevel: 4,
    }).then((diffs) => {
      treeNode = injectDiffs(treeNode, diffs)[0];
    });
  }*/
</script>

<Wrapper {jsonResource} path={[]} let:component let:node>
  <svelte:component
    this={component}
    path={[]}
    {node}
    on:loadDeeper={loadDeeper}
    {jsonResource} />
</Wrapper>

<!--
<svelte:component
  this={treeNode.component}
  props={treeNode.props}
  expanded={true}
  on:loadDeeper={loadDeeper} />
-->
