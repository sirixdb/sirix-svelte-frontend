<script lang="ts">
  export let checked: boolean;
</script>

<label
  for="slider"
  class="relative inline-block float-left m-1 w-10 h-6 bg-blue-500 rounded-full">
  <input bind:checked={checked} type="checkbox" id="slider" class="w-0 h-0 opacity-0" />
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
