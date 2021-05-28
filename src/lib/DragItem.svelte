<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { setDataImage } from "./domHelpers";
  import { key } from "./context";

  export let index = 0;
  export let draggable = true;

  let nextIndex = index;

  let isDragging = false;

  const pos = spring({ x: 0, y: 0 });

  $: pos.set({
    x: 0,
    y: nextIndex * $meta.itemDimension[1],
  });

  $: {
    const { dragIds } = $meta;
    const offset = dragIds.reduce((acc, cur) => {
      if (nextIndex > cur) return ++acc;
      return acc;
    }, 0);

    nextIndex = nextIndex - offset;
  }

  const meta = getContext(key);

  const handleDragStart = (e) => {
    setDataImage(e);
    console.log("dragstart");

    // tell other items which ids are being dragged
    meta.update((store) => {
      store.dragIds.push(index);
      return store;
    });
    isDragging = true;
  };

  const handleDrag = (e) => {
    console.log("dragging");

    const { clientX, clientY } = e;
    const { left: offsetX, top: offsetY } = $meta.wd;

    pos.set({
      x: clientX - offsetX,
      y: clientY - offsetY,
    });
  };

  const handleDragEnd = () => {
    console.log("dragend");

    pos.set({
      x: 0,
      y: nextIndex * $meta.itemDimension[1],
    });
    meta.update((store) => {
      store.dragIds = [];
      return store;
    });
    isDragging = false;
  };
</script>

{#if $meta.ready}
  <div
    {draggable}
    on:dragstart={handleDragStart}
    on:dragend={handleDragEnd}
    on:drag|stopPropagation={handleDrag}
    on:drop|preventDefault={() => null}
    on:dragover|preventDefault={() => null}
    class="drag-item"
    style={`
  width: ${$meta.itemDimension[0]}px;
  height: ${$meta.itemDimension[1]}px;
  position: ${isDragging ? "fixed" : "absolute"};
  transform: translate(${$pos.x}px, ${$pos.y}px);
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
  }
</style>
