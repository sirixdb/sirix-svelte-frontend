<script lang="ts">
  export let checked: boolean;
</script>

<label
  for="diff-checkbox"
  class="relative inline-block float-left m-1 w-10 h-6 bg-blue-500 rounded-full">
  <input bind:checked={checked} type="checkbox" id="diff-checkbox" class="w-0 h-0 opacity-0" />
  <span
    style="transition: background-color .2s"
    class="absolute text-center cursor-pointer rounded-full inset-0 {checked ? 'bg-blue-400' : 'bg-gray-400'}">
    Diff
  </span>
</label>
