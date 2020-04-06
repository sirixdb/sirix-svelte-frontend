<script>
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

  let tree;
  let diffType;
  let diffObj;
  let isContainer;
  $: {
    diffType = Object.keys(props.diffNode)[0];
    diffObj = props.diffNode[diffType];
    isContainer = diffObj.type == "jsonFragment";
    if (isContainer) {
      tree = buildTree(JSON.parse(diffObj.data));
      console.log(tree);
    }
  }
</script>

<style>
  span,
  div {
    background-color: rgba(0, 255, 0, 0.4);
  }
</style>

{#if (diffType === 'update') | !isContainer}
  <span>{diffObj.value}</span>
{:else}
  <div>
    <svelte:component
      this={tree.component}
      data={tree.data}
      child={tree.child} />
  </div>
{/if}
