<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let loggingIn: boolean;

  function getFormData() {
		dispatch('message', {
      username,
      password,
      sirixUri
		});
  }
  
  // form values
  let uri = "";
  let username = "admin";
  let password = "admin";
  let sirixUri;
  $: sirixUri = uri ? uri : "https://localhost:9443";

  // class style values
  let enabled =
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-default";
  let disabled =
    "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed";
  let loading =
    "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-wait";
</script>

<div class="inline-block mt-8">
  <form class="text-2xl">
    <div>
      <label class="block" for="username">Username</label>
      <input
        bind:value={username}
        class="rounded text-2xl p-2"
        name="username"
        type="text" />
    </div>
    <div>
      <label class="block" for="password">Password</label>
      <input
        bind:value={password}
        class="rounded text-2xl p-2"
        name="password"
        type="password" />
    </div>
    <div>
      <label class="block" for="sirixUri">SirixUri</label>
      <input
        class="rounded text-2xl p-2"
        placeholder="https://localhost:9443"
        bind:value={uri}
        type="url"
        name="sirixUri" />
    </div>
    <button
      class={loggingIn ? loading : username.length !== 0 && password.length !== 0 ? enabled : disabled}
      type="button"
      disabled={loggingIn || username.length === 0 || password.length === 0}
      on:click={getFormData}>
      Login
    </button>
  </form>
</div>
