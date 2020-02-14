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

<section class="inline-block float-left">
  <Tree />
</section>

<section class="inline-block float-left ml-4">
  <History />
</section>

<section class="inline-block float-left ml-4">
  <Controller />
</section>
