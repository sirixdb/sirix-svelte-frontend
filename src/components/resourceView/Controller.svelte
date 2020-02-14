<script lang="ts">
  import { sirix } from "../../sirix";

  import { onDestroy } from "svelte";
  import { selected, jsonResource } from "../../store";
  let dbName: string;
  let dbType: string;
  let resourceName: string;
  const unsubscribe = selected.subscribe(sel => {
    let { dbName, dbType, resourceName, revision } = sel;
    if (resourceName && revision) {
      loadRevision(dbName, dbType, resourceName, revision);
    }
  });
  onDestroy(unsubscribe);

  const loadRevision = (
    dbName: string,
    dbType: string,
    resourceName: string,
    revision: number
  ) => {
    sirix.database(dbName, dbType).then(db => {
      db.resource(resourceName).read(null, revision, 2, true)
        .then((jsonRes: JSON) => {
          jsonResource.set(jsonRes);
          console.log(jsonRes)
        })
    })
  };
</script>
