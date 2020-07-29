<script>
  // whenever logged out, redirect to login
  import { goto } from "@sapper/app";
  import { loggedIn } from "../../store";

  const checkLogin = () => {
    if (!$loggedIn) {
      goto("./login");
    }
  }
  if (typeof window !== 'undefined') {
    checkLogin();
  }
</script>