<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { key, StateNames } from "./context";
  import { isEqualSet } from "./compare-set";

  export let index = 0;
  export let draggable = true;
  export let isSelected = false;

  /** @type {number} temporary index while in drag state */
  let nextIndex = index;

  let isBeingDragged = false;
  let offset = [0, 0];
  let _dragIds = new Set();
  let _abortDragPromise = null;

  const pos = spring(null, {
    stiffness: 0.1,
    damping: 0.4,
  });

  const { store, dragEnd } = getContext(key);

  store.onTransit(StateNames.dragging, (store) => {
    if (!isSelected) return;
    store.selectedIds.add(index);
  });

  $: {
    const { dragIds } = $store;
    if (!isEqualSet(dragIds, _dragIds)) {
      _dragIds = new Set(dragIds);
      let offset = 0;
      dragIds.forEach((idx) => {
        if (nextIndex > idx) {
          offset++;
        }
      });

      nextIndex = nextIndex - offset;
    }

    if (nextIndex !== index && $store.state === StateNames.idle) {
      nextIndex = index;
    }
  }

  $: {
    if ($store.state === StateNames.dragging && $store.dragIds.has(index)) {
      pos.set(
        $store.pos.map(
          (v, i) => v - offset[i] - (i === 0 ? window.scrollX : window.scrollY)
        )
      );
    } else {
      pos.set([0, nextIndex * $store.itemDimension[1]]);
    }
  }

  const handleMouseDown = async (e) => {
    if (!draggable || e.button === 2) return;

    try {
      const { abort, promise } = store.dragUntil(10);
      _abortDragPromise = abort;
      document.addEventListener("mouseup", handleMouseUpAbort);
      await promise;

      const { offsetX, offsetY } = e;
      offset = [offsetX, offsetY];
      isBeingDragged = true;
      store.transit(StateNames.dragging, { dragId: index });

      document.addEventListener("mouseup", handleMouseUp);
    } catch (e) {
      return;
    }
  };

  const handleMouseUpAbort = () => {
    if (_abortDragPromise) _abortDragPromise();
    document.removeEventListener("mouseup", handleMouseUpAbort);
  };

  const handleMouseUp = () => {
    offset = [0, 0];
    isBeingDragged = false;
    document.removeEventListener("mouseup", handleMouseUp);
    dragEnd();
  };
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
  position: ${isBeingDragged ? "fixed" : "absolute"};
  z-index: ${isBeingDragged ? "10" : "1"};
  transform: translate(${$pos[0]}px, ${$pos[1]}px);
`}
  >
    <div class="debug-index">{nextIndex}</div>
    <slot isDragging={isBeingDragged} />
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
