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

    store.transition("idle");
  };

  setContext(key, {
    store,
    dragEnd,
  });

  onMount(() => {
    store.update((store) => {
      if (!ref) return store;

      store.wd = ref.getBoundingClientRect();
      store.itemDimension = itemDimension;
      store.ready = true;

      return store;
    });
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

  const handleScroll = () => {
    store.update((store) => {
      store.wd = ref.getBoundingClientRect();
      return store;
    });
  };
</script>

<svelte:window on:mousemove={handleMove} on:scroll={handleScroll} />
<div style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
  {$store.pos.join(" | ")}
  <br />
  {$store.wd?.left} | {$store.wd?.top}
</div>
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
  }
</style>
