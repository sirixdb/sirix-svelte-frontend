<script lang="ts">
  export let node;
  export let dbName, dbType;
  export let resourceName;
  export let revision;
  export let diff;

  import { createTree, loadDiffs, inject, injectDiffs } from "./buildTree";
  import { sirix } from "../../sirix";
  import { DBType } from "sirixdb";
  import { selected } from "../../store";

  let treeNode = createTree(node, []);

  const loadDeeper = ({ detail }) => {
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
  };

  if (diff && diff !== revision) {
    if (diff < revision) {
      selected.update((old) => ({ ...old, revision: diff, diff: revision }));
    }
    loadDiffs(revision, diff, dbName, dbType, resourceName, {
      maxLevel: 4,
    }).then((diffs) => {
      treeNode = injectDiffs(treeNode, diffs)[0];
    });
  }
</script>

<svelte:component
  this={treeNode.component}
  props={treeNode.props}
  expanded={true}
  on:loadDeeper={loadDeeper}
  firstLevel={true} />
