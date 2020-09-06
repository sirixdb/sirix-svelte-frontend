<script>
  import {
    getCaretCharacterOffsetWithin,
    setCurrentCursorPosition
  } from "./positionUtils";
  import { tick } from "svelte";
  import { sirix } from "../../sirix";
  import { dataStore, queryStore, subTreeStore } from "./store";
  import * as tauri_db from "../../lib/tauri_db.ts";
  import * as browser_db from "../../lib/browser_db.ts";
  const { addToQueries } = process.tauri ? tauri_db : browser_db;
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

  let isLoading = false;
  let baseStyle =
    "bg-blue-500 text-white font-bold py-2 px-4 my-2 mx-4 rounded fixed";
  let enabled = `${baseStyle} cursor-pointer`;
  let disabled = `${baseStyle} opacity-50 cursor-not-allowed`;
  let loading = `${baseStyle} opacity-50 cursor-wait`;

  const handleSave = async () => {
    addToQueries("favorites", text, true);
  };

  const handleQuery = async () => {
    isLoading = true;
    addToQueries("recents", text, true);
    sirix
      .query({ query: text })
      .then(data => {
        data = JSON.parse(data)
        subTreeStore.set([]);
        dataStore.set(data);
        isLoading = false;
      })
      .catch(error => {
        console.error(error);
        isLoading = false;
      });
  };
  const handleKeydown = event => {
    if (event.ctrlKey) {
      if (event.keyCode == 10 || event.keyCode == 13 || event.metaKey) {
        handleQuery();
      } else if (event.keyCode == 83) {
        handleSave();
      }
    }
  };
</script>

<pre class="my-0">
  <code
    on:input={render}
    on:keydown|stopPropagation={handleKeydown}
    contenteditable
    class="block h-32 hljs">
    {@html html}
  </code>
</pre>
<button
  title="CTRL+ENTER"
  class={isLoading ? loading : text.length !== 0 ? enabled : disabled}
  disabled={text.length === 0}
  on:click={handleQuery}
  style="right: 30vw"
  type="button">
  Query
</button>
<button
  title="CTRL+S"
  class={text.length !== 0 ? enabled : disabled}
  disabled={text.length === 0}
  on:click={handleSave}
  style="right: calc(30vw + 100px);"
  type="button">
  Save
</button>
