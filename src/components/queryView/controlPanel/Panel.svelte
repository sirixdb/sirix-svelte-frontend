<script lang="typescript">
  import * as tauri_db from "../../../lib/tauri_db";
  import * as browser_db from "../../../lib/browser_db";
  const {
    getQueries,
    removeFromQueriesByIndex,
    refreshQueries,
  //@ts-ignore
  } = process.tauri ? tauri_db : browser_db;
  import { onMount } from "svelte";
  import QueryList from "./QueryList.svelte";

  let recents: string[] = [];
  let favorites: string[] = [];

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
