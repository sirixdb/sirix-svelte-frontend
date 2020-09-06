<script>
  import Nav from '../components/Nav.svelte';

  if (process.tauri) {
    const { init } = require("../lib/tauri_db.ts");
    init();
  }

  export let segment;
</script>

<Nav {segment}/>

<main>
  <slot></slot>
</main>