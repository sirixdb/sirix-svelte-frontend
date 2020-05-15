<script>
  import Nav from '../components/Nav.svelte';
  import '../css/global.css';

  export let segment;
</script>

<Nav {segment}/>

<main>
  <slot></slot>
</main>