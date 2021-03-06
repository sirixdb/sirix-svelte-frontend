<script lang="typescript">
  import Tree from "../components/dbsView/Tree.svelte";
  import History from "../components/historyView/History.svelte";
  import Controller from "../components/resourceView/Controller.svelte";

  import CheckLogin from "../components/login/CheckLogin.svelte";

  import { DBType } from "sirixdb";

  let historyColumn, diffColumn;

  // store (`shift`) to control hiding the db-view, and to show the diff selection view
  import { tweened } from "svelte/motion";
  import { sineInOut } from "svelte/easing";

  let shift = tweened(0, {
    duration: 750,
    easing: sineInOut,
  });

  import { selected, refreshHistory, diffView } from "../store";
  import { sirix } from "../sirix";
  let history = [];

  let dbName, dbType, resourceName;
  $: ({ dbName, dbType, resourceName } = $selected);

  $: {
    $refreshHistory;
    history = [];
    if (dbName && resourceName && dbType) {
      const resource = sirix
        .database(dbName, dbType === "json" ? DBType.JSON : DBType.XML)
        .resource(resourceName);
      resource.history().then((res) => {
        history = res;
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
  /*
  div,
  #history-view,
  #diff-view {
    contain: strict;
  }
  */
  #grid-container {
    display: grid;
    column-gap: 20px;
    grid-auto-columns: 4fr 3fr 0 10fr;
    grid-auto-rows: calc(100vh - 54.6px);
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
    box-sizing: border-box;
    white-space: nowrap;
  }
</style>

<CheckLogin />

<div id="grid-container" class="bottom-0">
  <section
    id="dbs-view"
    class="overflow-y-scroll bottom-0 min-h-full scroll"
    style="margin-right: calc(100vw / 17 * 4 * {$shift}); margin-left:
    calc(-100vw / 17 * 4 * {$shift});">
    <Tree />
  </section>

  <section
    bind:this={historyColumn}
    id="history-view"
    class="overflow-y-scroll bottom-0 min-h-full scroll"
    style="width: max(calc(100vw / 17 * 3.4 * {$shift}), calc(100vw / 17 * 3));
    margin-right: calc(100vw / 17 * 3.6 * {$shift}); margin-left: calc(-100vw /
    17 * 3.6 * {$shift});">
    <History {history} />
  </section>

  {#if $shift}
    <section
      bind:this={diffColumn}
      id="diff-view"
      class="overflow-y-scroll bottom-0 min-h-full scroll"
      style="width: calc(100vw / 17 * 3.4 * {$shift}); margin-right: calc(100vw
      / 17 * 3.6 * {$shift}); margin-left: calc(-100vw / 17 * 3.6 * {$shift});">
      <History {history} diffColumn={true} />
    </section>
  {/if}

  <section
    id="resource-view"
    class="bottom-0 min-h-full"
    on:scroll|stopPropagation>
    <Controller />
  </section>
</div>
