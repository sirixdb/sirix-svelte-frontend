<script lang="typescript">
  import { loggedIn } from "../store";
  import { goto } from "@sapper/app";
  export let segment: string;

  const logout = () => {
    loggedIn.set(false);
    goto("./login", { replaceState: true });
  }
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a, span {
    cursor: pointer;
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>

<svelte:head>
  <title>SirixDB Svelte GUI</title>
</svelte:head>

<nav>
  <ul>
    <li>
      <a class:selected={segment === undefined} href=".">Home</a>
    </li>
    {#if !$loggedIn}
      <li>
        <a class:selected={segment === 'login'} href="login">Login</a>
      </li>
    {:else}
      <li>
        <span on:click={logout}>logout</span>
      </li>
      <li>
        <a class:selected={segment === 'resources'} href="resources">
          Resources
        </a>
      </li>
      <li>
        <a class:selected={segment === 'query'} href="query">
          Query
        </a>
      </li>
    {/if}
  </ul>
</nav>
