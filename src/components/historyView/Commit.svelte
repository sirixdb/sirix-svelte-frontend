<script lang="ts">
  // Unfortunately, the preprocessor doesn't allow for importing interaces
  interface Commit {
    revisionTimestamp: string;
    revision: number;
    author: string;
    commitMessage: string;
  }
  export let commit: Commit;

 let date: string, time: string;
  $: [date, time] = commit.revisionTimestamp.split("T");
  
  import { selected } from "../../store";
  const selectRevision = () => {
    selected.update(info => {
      return {...info, revision: commit.revision};
    });
  };

  let showMessage = false;
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
    <div style="top: -3px" class="ml-4">
      <span on:click={selectRevision} class="text-gray-600 cursor-pointer">
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
          <span class="text-sm italic">
            No commit message
          </span>
        {/if}
        <br />
        <span class="text-sm">{commit.revisionTimestamp}</span>
      </div>
    </div>
  </div>
</li>
