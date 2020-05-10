<script>
  export let node;
  export let dbName, dbType;
  export let resourceName;
  export let revision;
  export let diff;

  import { createTree, loadDiffs, inject, injectDiffs } from "./buildTree.js";
  import { sirix } from "../../sirix";

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
          treeNode = inject(treeNode, toInsert, detail.path, detail.insertKey);
        });
    });
  };

  if (diff !== null) {
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
