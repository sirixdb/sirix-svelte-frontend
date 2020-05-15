<script>
  import {
    getCaretCharacterOffsetWithin,
    setCurrentCursorPosition
  } from "./positionUtils";
  import { tick } from "svelte";
  import { sirix } from "../../sirix";
  import { dataStore, queryStore } from "./store";
  import { addToQueries, refreshQueries } from "lib/db.js";
  import hljs from "highlight.js/lib/core";
  import xquery from "highlight.js/lib/languages/xquery";
  import "highlight.js/styles/tomorrow-night-eighties.css";
  hljs.registerLanguage("xquery", xquery);

  let text = "";
  let html = "";
  $: {
    text = $queryStore;
    style(text);
  }

  function style(text) {
    html = hljs.highlight("xquery", text).value;
  }

  async function render(event) {
    const position = getCaretCharacterOffsetWithin(event.target);
    queryStore.set(event.target.innerText);
    style(event.target.innerText);
    await tick();
    setCurrentCursorPosition(
      event.target,
      event.inputType === "insertParagraph"
        ? position + 1
        : position > 0
        ? position
        : 1
    );
  }

  let baseStyle =
    "bg-blue-500 text-white font-bold py-2 px-4 my-2 mx-4 rounded fixed";
  let enabled = `${baseStyle} cursor-default`;
  let disabled = `${baseStyle} opacity-50 cursor-not-allowed`;
  let loading = `${baseStyle} opacity-50 cursor-wait`;

  const handleClick = async () => {
    addToQueries("recents", text, true);
    sirix.query(text).then(data => {
      dataStore.set(data);
    });
  };
  const handleKeydown = event => {
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      handleClick();
    }
  };
</script>

<pre class="my-0">
  <code
    on:input={render}
    on:keydown={handleKeydown}
    contenteditable
    class="block h-32 hljs">
    {@html html}
  </code>
</pre>
<button
  title="CTRL+ENTER"
  class={text.length !== 0 ? enabled : disabled}
  disabled={text.length === 0}
  on:click={handleClick}
  style="right: 30vw"
  type="button">
  Query
</button>
