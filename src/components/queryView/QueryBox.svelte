<script lang="typescript">
  import { tooltip, Tooltip, notifications } from "renderless-svelte";
  import {
    getCaretCharacterOffsetWithin,
    setCurrentCursorPosition,
  } from "./positionUtils";
  import { tick } from "svelte";
  import { sirix } from "../../sirix";
  import { dataStore, queryStore, subTreeStore } from "./store";
  import * as tauri_db from "../../lib/tauri_db";
  import * as browser_db from "../../lib/browser_db";
  //@ts-ignore
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
        : position
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
      .then((data) => {
        try {
          const parsedData = JSON.parse(data);
          subTreeStore.set([]);
          dataStore.set(parsedData);
        } catch (e) {
          notifications.push(e);
        }
      })
      .catch((error) => {
        notifications.push(error);
        console.error(error);
      })
      .finally(() => {
        isLoading = false;
      });
  };
  const handleKeydown = (
    event: KeyboardEvent & {
      currentTarget: EventTarget & HTMLElement;
    }
  ) => {
    if (event.ctrlKey) {
      if (event.key === "Enter" || event.metaKey) {
        handleQuery();
        event.preventDefault();
      } else if (event.key == "s") {
        handleSave();
        event.preventDefault();
      }
    } else {
      if (event.key === "Tab") {
        const position = getCaretCharacterOffsetWithin(event.target);
        const before = (event.currentTarget.innerText as string).substring(
          0,
          position
        );
        const after = (event.currentTarget.innerText as string).substring(
          position,
          event.currentTarget.innerText.length
        );
        event.currentTarget.innerText = [before, "\t", after].join("");
        setCurrentCursorPosition(
          event.target,
          position + 2
        );
        render(event);
        event.preventDefault();
      }
    }
  };
</script>

<style>
  .tooltip {
    transform: translateX(-50%);
  }
  .tooltip:before {
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: gray transparent transparent transparent;
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    bottom: -5px;
  }
</style>

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
  use:tooltip={{ text: 'CTRL+ENTER' }}
  class={isLoading ? loading : text.length !== 0 ? enabled : disabled}
  disabled={text.length === 0}
  on:click={handleQuery}
  style="right: 30vw"
  type="button">
  Query
</button>
<button
  use:tooltip={{ text: 'CTRL+S' }}
  class={text.length !== 0 ? enabled : disabled}
  disabled={text.length === 0}
  on:click={handleSave}
  style="right: calc(30vw + 100px);"
  type="button">
  Save
</button>
<Tooltip let:options let:dimensions>
  {#if options}
    <div
      class="tooltip bg-gray-100 rounded text-gray-900 fixed py-1 px-2"
      style="left: {dimensions.x + dimensions.width / 2}px; top: calc({dimensions.y}px - 2.75rem - 5px);">
      <span>{options.text}</span>
    </div>
  {/if}
</Tooltip>
