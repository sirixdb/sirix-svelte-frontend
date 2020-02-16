<script>
  import Login from "../components/login/Login.svelte";
  import { goto } from "@sapper/app";
  import { loggedIn } from "../store";
  let message = ({ detail }) => {
    if (detail === "redirect") {
      loggedIn.set(true);
      goto("./databases", { replaceState: false });
    }
  };
</script>

<div class="w-11/12 text-center">
  <Login on:message={message} />
</div>
