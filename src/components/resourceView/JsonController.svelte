<script>
  export let node;
  export let dbName, dbType;
  export let resourceName;
  export let revision;
  export let diff;

  import { createTree, loadDiffs, inject, injectDiffs } from "./buildTree.js";
  import { sirix } from "../../sirix";
  import { selected, refreshResource } from "../../store";

  let treeNode = createTree(node, []);

  const loadDeeper = ({ detail }) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName)
        .readWithMetadata({
          nodeId: detail.key,
          revision,
          maxLevel: 3
        })
        .then(newNode => {
          const toInsert = newNode.value.map((obj, index) =>
            createTree(obj, detail.path, index)
          );
          if (diff) {
            loadDiffs(revision, diff, dbName, dbType, resourceName, {
              maxLevel: 4
            }).then(diffs => {
              treeNode = injectDiffs(
                inject(treeNode, toInsert, detail.path, detail.insertKey),
                diffs
              );
            });
          } else {
            inject(treeNode, toInsert, detail.path, detail.insertKey);
          }
        });
    });
  };

  if (diff && diff !== revision) {
    if (diff < revision) {
      selected.update(old => ({ ...old, revision: diff, diff: revision }));
    }
    loadDiffs(revision, diff, dbName, dbType, resourceName, {
      maxLevel: 4
    }).then(diffs => {
      treeNode = injectDiffs(treeNode, diffs)[0];
    });
  }
</script>

<div class="p-1">
  <svelte:component
    this={treeNode.component}
    props={treeNode.props}
    expanded={true}
    on:loadDeeper={loadDeeper} />
</div>
