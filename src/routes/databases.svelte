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

<section class="inline-block float-left h-screen">
  <Tree />
</section>

<section class="inline-block float-left ml-4 h-screen">
  <History />
</section>

<section style="top: 64px" class="overflow-hidden overflow-y-scroll w-3/5 right-0 fixed bottom-0">
  <Controller />
</section>
