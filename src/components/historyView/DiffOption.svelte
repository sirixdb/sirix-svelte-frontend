<script>
  let checked = false;
  import Compare from "icons/compare.svelte";
  import { diffView, selected, refreshResource } from "store";

  $: {
    diffView.set(checked);
    selected.update(old => ({ ...old, diff: 0 }));
    refreshResource.refresh();
  }
</script>

<label
  title="view differential"
  for="diff-checkbox"
  class="relative inline-block float-left m-1 w-10 h-6 bg-blue-500 rounded-full">
  <input
    bind:checked
    type="checkbox"
    id="diff-checkbox"
    class="w-0 h-0 opacity-0" />
  <span
    style="transition: background-color .2s"
    class="absolute text-center cursor-pointer rounded-full inset-0 {checked ? 'bg-blue-400' : 'bg-gray-400'}">
    <Compare size={25} />
  </span>
</label>
