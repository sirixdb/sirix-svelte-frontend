<script>
  import {
    openQueryDB,
    removeFromQueriesByIndex,
    refreshQueries
  } from "lib/db.js";
  import { onMount } from "svelte";
  import QueryList from "./QueryList.svelte";

  let recents = [];
  let favorites = [];

  const loadQueries = async () => {
    const db = await openQueryDB();
    recents = (await db.get("unbound_queries", "recents")) || [];
    favorites = (await db.get("unbound_queries", "favorites")) || [];
  };

  $: {
    if ($refreshQueries !== 0) {
      loadQueries();
    };
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
