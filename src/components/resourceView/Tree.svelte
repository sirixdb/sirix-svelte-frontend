<script lang="ts">
  export let dbName: string, dbType: string, resourceName: string;

  import { jsonResource } from "../../store";
  import { sirix } from "../../sirix";
  $: {
    if (dbName && dbType && resourceName) {
      sirix.database(dbName, dbType).then(db => {
        db.resource(resourceName).read()
      })
    }
  }
</script>
