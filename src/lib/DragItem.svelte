<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { key } from "./context";

  export let index = 0;
  export let draggable = true;

  let nextIndex = index;

  let isDragging = false;
  let offset = [0, 0];
  let _dragIds = [];

  const pos = spring([0, 0]);
  const { store, dragEnd } = getContext(key);

  $: {
    const { dragIds } = $store;
    if (_dragIds[0] !== dragIds[0]) {
      _dragIds = dragIds;
      const offset = dragIds.reduce((acc, cur) => {
        if (nextIndex > cur) return ++acc;
        return acc;
      }, 0);

      nextIndex = nextIndex - offset;
    }

    if (nextIndex !== index) {
      nextIndex = index;
    }
  }

  $: {
    if (isDragging) {
      pos.set($store.pos.map((v, i) => v - offset[i]));
    } else {
      pos.set([0, nextIndex * $store.itemDimension[1]]);
    }
  }

  const handleMouseDown = (e) => {
    if (!draggable) return;

    const { offsetX, offsetY } = e;
    offset = [offsetX, offsetY];

    store.drag(index);

    isDragging = true;

    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = (e) => {
    console.log("dragend");

    offset = [0, 0];
    isDragging = false;
    document.removeEventListener("mouseup", handleMouseUp);

    dragEnd();
  };

  $: console.log(nextIndex, index);
</script>

{#if $store.ready}
  <div
    on:mousedown|preventDefault|stopPropagation={handleMouseDown}
    on:dragstart|preventDefault|stopPropagation={() => null}
    on:drop|preventDefault={() => null}
    on:dragover|preventDefault={() => null}
    class="drag-item"
    style={`
  width: ${$store.itemDimension[0]}px;
  height: ${$store.itemDimension[1]}px;
  position: ${isDragging ? "fixed" : "absolute"};
  transform: translate(${$pos[0]}px, ${$pos[1]}px);
`}
  >
    <div class="debug-index">{nextIndex}</div>
    <slot />
  </div>
{/if}

<style>
  .drag-item {
    /** do not set top/left to 0 */
    top: auto;
    left: auto;
  }

  .debug-index {
    position: absolute;
    left: -2rem;
    opacity: 0.4;
    pointer-events: none;
  }
</style>
