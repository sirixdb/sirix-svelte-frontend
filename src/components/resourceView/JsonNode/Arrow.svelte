<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const opts = {
    duration: 300,
    easing: cubicOut
  };
  const rotate = tweened(0, opts);
  const move = tweened(0, opts);

  export let expanded: bool;
  $: {
    if (expanded) {
      rotate.set(90, {});
      move.set(4, {});
    } else {
      rotate.set(0, {});
      move.set(0, {});
    }
  }
</script>

<span
  style="transform: rotate({$rotate}deg) translateX({$move}px);"
  class="inline-block -ml-2 px-2 cursor-pointer hover:shadow-inner rounded-full">
  &#x1f892;
</span>
