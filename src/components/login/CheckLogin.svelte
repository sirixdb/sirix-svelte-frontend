<script>
  // whenever logged out, redirect to login
  import { goto } from "@sapper/app";
  import { loggedIn } from "store";
  import { onMount } from "svelte";

  onMount(() => {
    if (!$loggedIn) {
      goto("./login");
    }
  });
</script>