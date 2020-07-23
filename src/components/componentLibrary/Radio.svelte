<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let name = "";

  export let options = [];

  export let selected = undefined;

  let field = 1;

  function updater() {
    dispatch("updated", {
      field,
    });
  }
  $: field, updater();

  onMount(() => {
    updater();
  });
</script>

<style>
  .options {
    display: inline-flex;
  }
  label {
    padding: 15px;
    user-select: none;
    transition: background-color 0.25s;
    cursor: pointer;
    border-top: 2px black solid;
    border-bottom: 2px black solid;
  }
  label:first-of-type {
    border-radius: 15px 0px 0px 15px;
    border-left: 2px black solid;
  }
  label:last-of-type {
    border-radius: 0px 15px 15px 0px;
    border-right: 2px black solid;
  }
  input[type="radio"] {
    display: none;
  }
  .selected {
    background-color: black;
    color: white;
  }
</style>

<!--
  @component
  example usage:

  ```svelte
  <script>
    import Radio from "@componentLibrary/Radio.svelte";
    const options = [
      {text: "text to display for this option",
      value: "the value to be bound to the selected prop when this option is selected"}
    ];
    let name = "name to use as name attribute for the radio";
    let selected: string;
  </script>
  <Radio {name} {selected} {options} />
  ```
-->
<div class="options">
  {#each options as option}
    <label class:selected={selected === option.value}>
      <input type="radio" {name} bind:group={selected} value={option.value} />
      {option.text}
    </label>
  {/each}
</div>
