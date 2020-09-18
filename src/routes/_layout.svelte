<script lang="typescript">
  import Nav from "../components/Nav.svelte";
  import Close from "../components/icons/Close.svelte";
  import { Modal } from "renderless-svelte";
  import { init } from "../lib/tauri_db";
  //@ts-ignore
  if (process.tauri) {
    init();
  }

  export let segment;
</script>

<style>
  .backdrop {
    background: rgba(0, 0, 0, 0.32);
    z-index: 100;
  }
  .modal {
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.15),
      0px 24px 38px 3px rgba(0, 0, 0, 0.2), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
    left: 50%;
    top: 50%;
    min-height: 200px;
    min-width: 200px;
    transform: translate(-50%, -50%);
  }
  button {
    right: 0.5rem;
    top: 0.5rem;
  }
</style>

<Nav {segment} />

<main>
  <Modal let:payload let:close>
    <div
      class="backdrop flex flex-col justify-center fixed top-0 left-0 m-0 h-full
        w-full"
      on:click={close}>
      <div
        class="modal bg-white rounded p-5 absolute text-center"
        on:click|stopPropagation>
        <button
          class="absolute bg-transparent border-none cursor-pointer"
          on:click={close}
          aria-label="Close">
          <Close />
        </button>
        <svelte:component this={payload.component} {close} {...payload.props} />
      </div>
    </div>
  </Modal>
  <slot />
</main>
