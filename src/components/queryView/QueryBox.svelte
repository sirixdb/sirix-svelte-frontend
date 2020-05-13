<script>
  import {
    getCaretCharacterOffsetWithin,
    setCurrentCursorPosition
  } from "./utils";
  import { tick } from "svelte";
  import hljs from "highlight.js/lib/core";
  import xquery from "highlight.js/lib/languages/xquery";
  import "highlight.js/styles/tomorrow-night-eighties.css";
  hljs.registerLanguage("xquery", xquery);
  let textarea;
  let html = "";

  async function render(event) {
    const position = getCaretCharacterOffsetWithin(event.target);
    const text = event.target.innerText;
    html = hljs.highlight("xquery", text).value;
    await tick();
    setCurrentCursorPosition(event.target, position);
  }
</script>

<pre>
  <code
    on:input={render}
    bind:this={textarea}
    contenteditable="true"
    class="block h-32 hljs">
    {@html html}
  </code>
</pre>
