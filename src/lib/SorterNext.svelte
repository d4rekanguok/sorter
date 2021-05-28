<script>
  import { writable } from "svelte/store";
  import { setContext, onMount } from "svelte";
  import { key } from "./context";

  /** @type {[number, number]} [width, height] */
  export let itemDimension = [0, 0];

  /** @type {HTMLDivElement} */
  let ref;

  const meta = writable({
    /** @type {DOMRect} wrapperDimension */
    wd: null,

    /** @type {number[]} */
    itemDimension: [0, 0],

    /** @type {boolean} */
    ready: false,

    /** @type {string[]} indexes of elements being dragged */
    dragIds: [],
  });

  setContext(key, meta);

  onMount(() => {
    meta.update((store) => {
      if (!ref) return store;

      store.wd = ref.getBoundingClientRect();
      store.itemDimension = itemDimension;
      store.ready = true;

      return store;
    });
  });
</script>

<div
  bind:this={ref}
  class="wrapper"
  on:drop|preventDefault={() => null}
  on:dragover|preventDefault={() => null}
>
  <slot />
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: white;
  }
</style>
