<script>
  import { openQueryDB } from "../../../lib/db";
  import { onMount } from "svelte";

  let recent = [];
  let favorites = [];

  /*onMount(async () => {
    const db = await openQueryDB()
    recent = await db.get("recent") || [];
    favorites = await db.get("favorites") || [];
  });*/
</script>

