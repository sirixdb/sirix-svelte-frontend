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
    grid-template-columns: 4fr 3fr 10fr;
  }
  #dbs-view {
    grid-column: 0 1;
  }
  #history-view {
    grid-column: 1 2;
  }
  #resource-view {
    grid-column: 2 3;
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
    class="overflow-y-hidden overflow-y-scroll bottom-0 min-h-full">
    <Tree />
  </section>

  <section
    id="history-view"
    class="overflow-y-hidden overflow-y-scroll bottom-0 min-h-full">
    <History />
  </section>

  <section
    id="resource-view"
    class="overflow-y-hidden overflow-y-scroll bottom-0 min-h-full">
    <Controller />
  </section>
</div>
