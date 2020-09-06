<script>
  if (process.tauri) {
    const {
      getQueries,
      removeFromQueriesByIndex,
      refreshQueries,
    } = require("../../../lib/tauri_db.ts");
  } else {
    const {
      getQueries,
      removeFromQueriesByIndex,
      refreshQueries,
    } = require("../../../lib/browser_db.ts");
  }
  import { onMount } from "svelte";
  import QueryList from "./QueryList.svelte";

  let recents = [];
  let favorites = [];

  const loadQueries = async () => {
    const db = await openQueryDB();
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
