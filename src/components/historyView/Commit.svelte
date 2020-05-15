<script>
  /*
   * // interface of `commit` prop
   * interface Commit {
   *   revisionTimestamp: string;
   *   revision: number;
   *   author: string;
   *   commitMessage: string;
   * }
   */
  export let commit;
  export let diffColumn;

  $: [date, time] = commit.revisionTimestamp.split("T");

  import { selected, refreshResource } from "store";
  const selectRevision = () => {
    let refresh = true;
    if (!diffColumn) {
      selected.update(old => {
        if (old.revision === commit.revision) {
          refresh = false;
        }
        return { ...old, revision: commit.revision };
      });
    } else {
      selected.update(old => {
        if (old.diff === commit.revision) {
          refresh = false;
        }
        return { ...old, diff: commit.revision };
      });
    }
    if (refresh) {
      refreshResource.refresh();
    }
  };

  let showMessage = false;
  let element, isSelected;

  $: {
    isSelected =
      ($selected.revision === commit.revision && !diffColumn) ||
      ($selected.diff === commit.revision && diffColumn);
    if (isSelected) {
      element && element.scrollIntoView();
    }
  }
</script>

<li
  class="inline"
  on:mouseenter={() => (showMessage = true)}
  on:mouseleave={() => (showMessage = false)}>
  <div class="relative">
    <!-- begin time-line -->
    <div
      style="left: 4px"
      class="absolute h-full border-0 border-l-2 border-solid border-gray-200" />
    <div style="left: -1px" class="absolute rounded-full bg-gray-200 w-3 h-3" />
    <!-- end time-line -->
    <div
      bind:this={element}
      on:click={selectRevision}
      style="top: -3px"
      class="ml-4 cursor-pointer {isSelected ? 'shadow-2xl bg-gray-300' : ''}">
      <span class="text-gray-600">
        {date}
        <br />
        {time}
      </span>
      <div class="shadow-lg p-4 rounded-sm max-w-xs">
        <span class="font-bold italic">{commit.revision}</span>
        <span class="block font-bold">{commit.author}</span>
        {#if commit.commitMessage !== ''}
          <span class="block {showMessage ? '' : 'truncate'}">
            {commit.commitMessage}
          </span>
        {:else}
          <span class="text-sm italic">No commit message</span>
        {/if}
        <br />
        <span class="text-sm">{commit.revisionTimestamp}</span>
      </div>
    </div>
  </div>
</li>
