<script>
  import Tree from "../components/dbsView/Tree.svelte";
  import History from "../components/historyView/History.svelte";
  import Controller from "../components/resourceView/Controller.svelte";

  // whenever logged out, redirect to login
  import { goto } from "@sapper/app";
  import { loggedIn } from "../store";

  $: {
    (loggedIn => {
      if (!$loggedIn) {
        goto("./login");
      }
    })(loggedIn);
  }
</script>

<style>
  #grid-container {
    display: grid;
    column-gap: 20px;
    grid-auto-columns: 4fr 3fr 10fr;
    grid-auto-rows: calc(100vh - 57px);
    grid-template-areas: "dbs-view history-view resource-view"
  }
  #dbs-view {
    max-height: 100%;
    grid-area: dbs-view;
  }
  #history-view {
    grid-area: history-view;
  }
  #resource-view {
    grid-area: resource-view;
  }

  section::-webkit-scrollbar {
    width: 0.5rem;
  }
  section::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  section::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
</style>

<div style="top: 64px" id="grid-container" class="bottom-0">
  <section
    id="dbs-view"
    class="overflow-y-scroll bottom-0 min-h-full">
    <Tree />
  </section>

  <section
    id="history-view"
    class="overflow-y-scroll bottom-0 min-h-full">
    <History />
  </section>

  <section
    id="resource-view"
    class="overflow-y-scroll bottom-0 min-h-full">
    <Controller />
  </section>
</div>
