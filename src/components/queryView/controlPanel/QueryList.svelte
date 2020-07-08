<script>
  import { createEventDispatcher } from "svelte";
  const dispatcher = createEventDispatcher();
  import Arrow from "../../icons/Arrow.svelte";
  import Trash from "../../icons/Trash.svelte";
  import { expandAndFade } from "../../../utils/transition.js";
  import { queryStore } from "../store";
  export let list;
  export let typeOfQueries;
  $: header = typeOfQueries === "recents" ? "Recent" : "Favorites";
  let expanded = true;
  const toggle = () => {
    expanded = !expanded;
  };
  const handleDelete = (index) => {
    dispatcher("delete", { type: typeOfQueries, index });
  };
  let showFullQuery = null;
</script>

<style>
  .list {
    max-height: 20vh;
  }
  .trash {
    height: 23px;
    width: 23px;
  }
</style>

<div class="px-2">
  <div class="hover:bg-gray-200 p-2" on:click={toggle}>
    <Arrow {expanded} />
    <span>{header}</span>
  </div>
  {#if expanded}
    <div class="list overflow-y-scroll scroll ml-1" transition:expandAndFade>
      {#each list as item, index}
        <div
          on:mouseenter={() => {
            showFullQuery = index;
          }}
          on:mouseleave={() => {
            showFullQuery = null;
          }}
          on:click={() => queryStore.set(item)}
          class="py-1 my-1 ml-1 pl-1 hover:bg-gray-200 cursor-pointer">
          <span
            class="text-sm font-mono inline-block{showFullQuery === index ? '' : ' truncate'}"
            style="width: calc(100% - 30px);">
            {item}
          </span>
          <span
            on:click|stopPropagation={() => handleDelete(index)}
            class="trash inline-block cursor-pointer bg-red-600 rounded-full
            text-center float-right">
            <Trash color="#FFF" size={14} />
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
