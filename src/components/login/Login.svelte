<script>
  // component
  import Inner from "./Inner.svelte";
  // store
  import { loggedIn, dbInfo } from "../../store";
  // dispacter
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  // sirix
  import { sirix } from "../../sirix";

  // form control
  let loggingIn = false;

  let login = ({ detail }) => {
    loggingIn = true;
    sirix.authenticate(
      detail.username,
      detail.password,
      detail.sirixUri,
      () => {
        loggedIn.set(false);
      }
    );
    sirix.auth
      .authenticate()
      .then(ready => {
        if (ready) {
          loggedIn.set(true);
          sirix.getInfo().then(dbs => {
            dbInfo.set(dbs);
            dispatch("message", "redirect");
          });
        } else {
          loggedIn.set(false);
        }
      })
      .catch(err => {
        console.error(err);
        loggedIn.set(false);
      })
      .finally(() => {
        loggingIn = false;
      });
  };
</script>

<Inner on:message={login} bind:loggingIn />
