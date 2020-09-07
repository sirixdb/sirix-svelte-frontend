<script lang="typescript">
  import Nav from '../components/Nav.svelte';
  import { init } from "../lib/tauri_db";
  //@ts-ignore
  if (process.tauri) {
    init();
  }

  export let segment;
</script>

<Nav {segment}/>

<main>
  <slot></slot>
</main>