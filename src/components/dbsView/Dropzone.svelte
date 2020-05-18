<script lang="typescript">
  export let dbType;
  export let file: string | ArrayBuffer;
  export let fileName: string;
  let fileType;
  $: fileType = dbType === "json" ? "application/json" : "application/xml";

  let fileInput;
  const read = f => {
    const fr = new FileReader();
    fileName = f.name;
    fr.onload = () => {
      file = fr.result;
    };
    fr.onerror = e => {
      console.error(e);
    };
    fr.readAsBinaryString(f);
  };

  // for click
  const onChange = () => {
    read(fileInput.files[0]);
  };

  // for drag and drop
  const onDrop = ev => {
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[0].kind === "file") {
        read(ev.dataTransfer.items[0].getAsFile());
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      read(ev.dataTransfer.files[0]);
    }
  };
</script>

<label
  for="fileInput"
  on:dragover|preventDefault
  on:drop|preventDefault={onDrop}
  class="w-1/2 py-2 px-1 border-gray-900 border-dashed cursor-pointer">
  Click or drag a file here
  <input
    type="file"
    id="fileInput"
    accept={fileType}
    bind:this={fileInput}
    on:change|preventDefault={onChange}
    class="hidden" />
  <br />
</label>
