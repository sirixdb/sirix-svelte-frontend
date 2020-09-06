<script>
  import Nav from '../components/Nav.svelte';

  if (process.tauri) {
    import("../lib/tauri_db.ts").then(mod => {
      mod.init();
    });
  }

  export let segment;
</script>

<Nav {segment}/>

<main>
  <slot></slot>
</main>