<script lang="ts">
  import Tree from "../components/dbsView/Tree.svelte";
  import History from "../components/historyView/History.svelte";
  import Controller from "../components/resourceView/Controller.svelte";

  // whenever logged out, redirect to login
  import { goto } from "@sapper/app";
  import { loggedIn } from "../store";
  import { onMount } from "svelte";

  onMount(() => {
    if (!$loggedIn) {
      goto("./login");
    }
  });

  let historyColumn, diffColumn;
  let historyOffset, diffOffset;
  $: {
    if (historyColumn) {
      historyColumn.onscroll = () => {
        historyOffset = historyColumn.scrollTop;
      };
    }
    if (diffColumn) {
      diffColumn.onscroll = () => {
        diffOffset = diffColumn.scrollTop;
      };
    }
  }

  // store (`shift`) to control hiding the db-view, and to show the diff selection view
  import { tweened } from "svelte/motion";
  import { sineInOut } from "svelte/easing";

  const opts = {
    duration: 750,
    easing: sineInOut
  };

  let shift = tweened(0, opts);

  import { selected, refreshHistory, diffView } from "../store";
  import { sirix } from "../sirix";
  let history = [];

  $: {
    $refreshHistory;
    let { dbName, dbType, resourceName } = $selected;
    if (dbName && resourceName && dbType) {
      sirix.database(dbName).then(db => {
        db.resource(resourceName)
          .history()
          .then(res => {
            history = res;
          });
      });
    }
  }

  $: {
    if ($diffView) {
      shift.set(1);
    } else {
      shift.set(0);
    }
  }
</script>

<style>
  div,
  #history-view,
  #diff-view {
    contain: strict;
  }
  #grid-container {
    display: grid;
    column-gap: 20px;
    grid-auto-columns: 4fr 3fr 0 10fr;
    grid-auto-rows: calc(100vh - 57px);
    grid-template-areas: "dbs-view history-view diff-view resource-view";
  }
  #dbs-view {
    max-height: 100%;
    grid-area: dbs-view;
  }
  #history-view {
    grid-area: history-view;
  }
  #diff-view {
    grid-area: diff-view;
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
    class="overflow-y-scroll bottom-0 min-h-full"
    style="margin-right: calc(100vw / 17 * 4 * {$shift}); margin-left:
    calc(-100vw / 17 * 4 * {$shift});">
    <Tree />
  </section>

  <section
    bind:this={historyColumn}
    id="history-view"
    class="overflow-y-scroll bottom-0 min-h-full"
    style="width: max(calc(100vw / 17 * 3.4 * {$shift}), calc(100vw / 17 * 3));
    margin-right: calc(100vw / 17 * 3.6 * {$shift}); margin-left: calc(-100vw /
    17 * 3.6 * {$shift});">
    <History {history} offset={historyOffset} />
  </section>

  {#if $shift}
    <section
      bind:this={diffColumn}
      id="diff-view"
      class="overflow-y-scroll bottom-0 min-h-full"
      style="width: calc(100vw / 17 * 3.4 * {$shift}); margin-right: calc(100vw
      / 17 * 3.6 * {$shift}); margin-left: calc(-100vw / 17 * 3.6 * {$shift});">
      <History {history} diffColumn={true} offset={diffOffset} />
    </section>
  {/if}

  <section id="resource-view" class="overflow-y-scroll bottom-0 min-h-full">
    <Controller />
  </section>
</div>
