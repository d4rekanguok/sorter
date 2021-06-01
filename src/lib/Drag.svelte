<script>
  import { setContext, onMount, createEventDispatcher } from "svelte";

  import { key, createStore } from "./context";
  import { unplace } from "./strategies/vertical";

  const dispatch = createEventDispatcher();

  /** @type {[number, number]} [width, height] */
  export let itemDimension = [0, 0];

  /** @type {HTMLDivElement} */
  let ref;

  const store = createStore();
  const dragEnd = () => {
    const { dropIndex, dragIds } = $store;
    dispatch("dragend", {
      cancelled: false,
      dropIndex,
      dragIds,
    });

    store.reset();
  };

  setContext(key, {
    store,
    dragEnd,
  });

  const handleMove = (e) => {
    const { clientX, clientY } = e;
    store.update((store) => {
      const { wd } = store;
      const { left: offsetX, top: offsetY } = wd;

      const x = clientX - offsetX;
      const y = clientY - offsetY;

      store.pos = [x, y];

      store.dropIndex = unplace({
        position: [x, y],
        scrollPosition: [0, 0],
        dimension: itemDimension,
        containerDimension: wd,
        length: 100,
      });

      return store;
    });
  };

  onMount(() => {
    store.update((store) => {
      if (!ref) return store;

      store.wd = ref.getBoundingClientRect();
      store.itemDimension = itemDimension;
      store.ready = true;

      return store;
    });
  });
</script>

<svelte:window on:mousemove={handleMove} />
<div>{$store.pos.join(" | ")}</div>
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
