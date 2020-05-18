<script lang="typescript">
  export let resources: string[];
  export let dbName: string;
  export let dbType: string;

  import Resource from "./Resource.svelte";

  import { expandAndFade } from "../../utils/transition.js";
</script>

<div transition:expandAndFade>
  {#each resources as resourceName}
    <Resource {resourceName} {dbName} {dbType} />
  {/each}
</div>
