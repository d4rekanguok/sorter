<script>
  import { setContext, onMount, createEventDispatcher } from "svelte";

  import { key, createStore, StateNames } from "./context";
  import { unplace, getContainerMaxDimension } from "./strategies/vertical";

  const dispatch = createEventDispatcher();

  /** @type {[number, number]} [width, height] */
  export let itemDimension = [0, 0];
  export let size = 0;
  let className;
  export { className as class };

  /** @type {HTMLDivElement} */
  let ref;

  const store = createStore();

  const dragEnd = () => {
    const { dropIndex, dragIds } = $store;
    dispatch("dragend", {
      cancelled: false,
      dropIndex,
      dragIds: Array.from(dragIds).sort((a, b) => a - b),
    });

    store.transit(StateNames.idle);
  };

  setContext(key, {
    store,
    dragEnd,
  });

  $: maxDimension = getContainerMaxDimension(size, itemDimension);

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
      const { wd, scrollPos, itemDimension } = store;
      const { left: offsetX, top: offsetY } = wd;
      const x = clientX - offsetX;
      const y = clientY - offsetY;

      store.pos = [x, y];

      store.dropIndex = unplace({
        position: [x, y],
        scrollPosition: scrollPos,
        dimension: itemDimension,
        containerDimension: wd,
        length: size,
      });

      return store;
    });
  };

  const handleWindowScroll = () => {
    store.update((store) => {
      store.wd = ref.getBoundingClientRect();
      return store;
    });
  };

  const handleManualScroll = () => {
    if (!ref) return;
    const y = ref.scrollTop;
    const x = ref.scrollLeft;

    store.update((store) => {
      store.scrollPos = [x, y];
      return store;
    });
  };
</script>

<svelte:window on:mousemove={handleMove} on:scroll={handleWindowScroll} />
<pre
  style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
cursor: {$store.pos.join(" | ")}
scrollPos: {$store.scrollPos.join(" | ")}
container dimension: {$store.wd?.left} | {$store.wd?.top}
</pre>

<div
  class="outer-wrapper {className}"
  bind:this={ref}
  on:scroll={handleManualScroll}
>
  <div
    class="inner-wrapper"
    style="width: {maxDimension[0]}px; height: {maxDimension[1]}px;"
  >
    <slot />
  </div>
</div>

<style>
  .inner-wrapper {
    position: relative;
  }

  .outer-wrapper {
    position: relative;
    overflow: scroll;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .outer-wrapper::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  .outer-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }

  .outer-wrapper::-webkit-scrollbar-thumb {
    background-color: pink;
    border-radius: 100px;
  }
</style>
