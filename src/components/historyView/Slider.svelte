<script>
  import { blur } from "svelte/transition";
  export let checked;
  export let id;
</script>

<label for="slider-{id}" class="select-none">
  <label
    for="slider-{id}"
    class="relative inline-block float-left m-1 w-10 h-6 bg-blue-500
    rounded-full">
    <input bind:checked type="checkbox" id="slider-{id}" class="w-0 h-0 opacity-0" />
    <span
      style="transition: .2s"
      class="absolute cursor-pointer rounded-full inset-0 {checked ? 'bg-blue-400' : 'bg-teal-500'}">
      <span
        style="left: 4px; bottom: 4px; transition: .2s; {checked ? 'transform: translateX(16px);' : ''}"
        class="absolute w-4 h-4 bg-gray-100 rounded-full">
        &nbsp;
      </span>
    </span>
  </label>
  <span class="float-left m-1 cursor-pointer">
    {#if checked}
      <span class="fixed" transition:blur={{ amount: 3, duration: 200 }}>
        Ascending
      </span>
    {:else}
      <span class="fixed" transition:blur={{ amount: 3, duration: 200 }}>
        Descending
      </span>
    {/if}
  </span>
</label>
