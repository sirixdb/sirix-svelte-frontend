<script lang="typescript">
  /**
   *  // interface of `database` prop
   *  interface Database {
   *    name: string;
   *    type: string;
   *    resources: string[];
   *  }
   */
  export let database;
  let expanded = false;
  let height: number;

  // transformations
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const opts = {
    duration: 300,
    easing: cubicOut,
  };
  const rotate = tweened(0, opts);
  const move = tweened(0, opts);
  $: {
    if (expanded) {
      rotate.set(90, {});
      move.set(2, {});
    } else {
      rotate.set(0, {});
      move.set(0, {});
    }
  }

  import Resources from "./Resources.svelte";
  import Trash from "../icons/Trash.svelte";
  import AddResource from "./AddResource.svelte";
  import DeleteDialog from "./DeleteDialog.svelte";

  import { openModal } from "renderless-svelte";
</script>

<div
  on:click={() => (expanded = !expanded)}
  class="cursor-pointer text-lg text-gray-100 opacity-100 hover:bg-gray-700 p-2
    m-2 mr-2 rounded-full">
  <span
    style="transform: rotate({$rotate}deg) translateX({$move}px);"
    class="float-left mr-2 select-none">
    &rsaquo;
  </span>
  <span>{database.name}</span>
  <span
    on:click|stopPropagation={() => openModal({
        component: DeleteDialog,
        props: {
          dbName: database.name,
          dbType: database.type,
        },
      })}
    style="height: {height}px; width: {height}px;"
    class="float-right cursor-pointer bg-red-600 rounded-full text-center ml-2">
    <Trash color="#FFF" size={height - 10} />
  </span>
  <span
    on:click|stopPropagation={() => openModal({
        component: AddResource,
        props: {
          dbName: database.name,
          dbType: database.type,
        },
      })}
    bind:clientHeight={height}
    style="width: {height}px;"
    class="float-right cursor-pointer rounded-full bg-blue-300 hover:bg-blue-200
      text-center ml-2 m-auto text-blue-900 select-none">
    &plus;
  </span>
</div>

{#if expanded}
  <Resources
    resources={database.resources ? database.resources : []}
    dbName={database.name}
    dbType={database.type} />
{/if}
