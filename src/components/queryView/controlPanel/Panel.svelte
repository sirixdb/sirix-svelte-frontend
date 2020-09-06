<script>
  import * as tauri_db from "../../../lib/tauri_db.ts";
  import * as browser_db from "../../../lib/browser_db.ts";
  const {
    getQueries,
    removeFromQueriesByIndex,
    refreshQueries,
  } = process.tauri ? tauri_db : browser_db;
  import { onMount } from "svelte";
  import QueryList from "./QueryList.svelte";

  let recents = [];
  let favorites = [];

  const loadQueries = async () => {
    recents = (await getQueries("recents")) || [];
    favorites = (await getQueries("favorites")) || [];
  };

  $: {
    if ($refreshQueries !== 0) {
      loadQueries();
    }
  }

  const handleDelete = ({ detail }) => {
    removeFromQueriesByIndex(detail.type, detail.index);
  };

  onMount(() => {
    loadQueries();
  });
</script>

<QueryList list={recents} on:delete={handleDelete} typeOfQueries={'recents'} />

<QueryList
  list={favorites}
  on:delete={handleDelete}
  typeOfQueries={'favorites'} />
