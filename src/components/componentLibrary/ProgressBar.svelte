<script>
  import ProgressCircle from "svelte-progresscircle/src/index.svelte";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  export let value = 0;
  const tweenedValue = tweened(value, {
    duration: 400,
    easing: cubicInOut,
  });
  $: tweenedValue.set(value);
  $: progressColor =
    $tweenedValue < 25 ? "#EF476F" : $tweenedValue > 75 ? "#BFF0B0" : "#FFD166";
</script>

<style>
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: x-large;
  }
</style>

<progress-circle-wrapper style="--progress-color: {progressColor}">
  <ProgressCircle max={100} value={$tweenedValue}>
    <span>{Math.round($tweenedValue)}%</span>
  </ProgressCircle>
</progress-circle-wrapper>
