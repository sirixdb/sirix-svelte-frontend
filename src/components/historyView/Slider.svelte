<script lang="ts">
  export let checked: boolean;
</script>

<label
  for="slider"
  class="relative inline-block w-10 h-6 bg-blue-500 rounded-full">
  <input bind:checked={checked} type="checkbox" id="slider" class="w-0 h-0 opacity-0" />
  <span
    style="transition: .3s"
    id="switch"
    class="absolute cursor-pointer rounded-full inset-0 bg-teal-500 {checked ? 'bg-blue-400' : ''}">
    <span
      style="left: 4px; bottom: 4px; transition: .4s; {checked ? 'transform: translateX(16px);' : ''}"
      class="absolute w-4 h-4 bg-gray-100 rounded-full">
      &nbsp;
    </span>
  </span>
</label>
