<script>
  import { onDestroy, onMount } from "svelte";

  import Container from "./DiffNode/Container.svelte";
  import Value from "./DiffNode/Value.svelte";
  import Key from "./DiffNode/Key.svelte";

  const buildTree = (data, key) => {
    let tree = {};
    if (Array.isArray(data)) {
      tree["component"] = Container;
      tree["child"] = data.map(obj => buildTree(obj));
      tree["data"] = data;
    } else if (typeof data === "object") {
      tree["component"] = Container;
      tree["child"] = Object.keys(data).map(key => buildTree(data[key], key));
      tree["data"] = data;
    } else if (key !== undefined) {
      tree["component"] = Key;
      tree["child"] = buildTree(data);
      tree["data"] = key;
    } else {
      tree["component"] = Value;
      tree["data"] = data;
    }
    return tree;
  };

  export let props;

  let element;

  let tree;
  let diffType;
  let diffObj;
  let isContainer;
  $: {
    diffType = Object.keys(props.diffNode)[0];
    diffObj = props.diffNode[diffType];
    isContainer = diffObj.type === "jsonFragment";
    if (isContainer) {
      tree = buildTree(JSON.parse(diffObj.data));
    }
    if (diffType === "delete") {
      onMount(() => {
        element.parentNode.style.background = "rgb(255,0,0,0.4)";
        element.parentNode.style.marginBottom = element.parentNode.style.marginTop =
          "1px";
      });
      onDestroy(() => {
        element.parentNode.style.marginBottom = element.parentNode.style.marginTop = element.parentNode.style.background =
          "";
      });
    } else if (diffType === "replace" || diffType == "update") {
      onMount(() => {
        const arr = Array.from(element.parentNode.children);
        arr[1].style.background = "rgb(255,0,0,0.4)";
      });
      onDestroy(() => {
        const arr = Array.from(element.parentNode.children);
        arr[1].style.background = "";
      });
    }
  }
</script>

<style>
  span,
  div {
    background-color: rgba(0, 255, 0, 0.4);
    margin-top: 1px;
    margin-bottom: 1px;
  }
</style>

<span bind:this={element} />

{#if diffType !== 'delete'}
  {#if !isContainer}
    <span class="pl-4">{diffType === "update" ? diffObj.value : diffObj.data}</span>
  {:else}
    <div>
      <svelte:component
        this={tree.component}
        data={tree.data}
        child={tree.child} />
    </div>
  {/if}
{/if}

{#if props.nextDiff.diff}
  <svelte:self
    props={{ ...props.nextDiff.diff, nextDiff: props.nextDiff.diff.props }} />
{/if}
