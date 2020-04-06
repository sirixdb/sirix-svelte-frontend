<script>
  export let resources;
  export let dbName;
  export let dbType;

  import Resource from "./Resource.svelte";

  import { expandAndFade } from "../../utils/transition";

</script>

<div transition:expandAndFade>
  {#each resources as resourceName}
    <Resource {resourceName} {dbName} {dbType} />
  {/each}
</div>
