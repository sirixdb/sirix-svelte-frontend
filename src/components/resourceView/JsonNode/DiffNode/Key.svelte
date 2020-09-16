<script>
  export let props;
</script>

<span>{props.child}:</span>

<svelte:component this={props.data.component} props={props.data} />
