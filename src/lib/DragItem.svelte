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

  /** @type {'idle' | 'dragging'} */
  let state = "idle";
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
      const i = Array.from($store.dragIds)
        .sort((a, b) => a - b)
        .indexOf(index);
      pos.set(
        getPos(
          $store.pos,
          $store.offsetPos,
          [window.scrollX, window.scrollY],
          i
        )
      );
    } else {
      pos.set([0, nextIndex * $store.itemDimension[1]]);
    }
  }

  /**
   * Calculate absolute position based on cursor pos
   * @param {[number, number]} pos
   * @param {[number, number]} offsetPos
   * @param {[number, number]} globalScrollPos
   * @param {number} i
   * @returns {[number, number]}
   */
  const getPos = (pos, offsetPos, globalScrollPos, i = 0) => {
    const x = pos[0] - offsetPos[0] - globalScrollPos[0] - i * 10;
    const y = pos[1] - offsetPos[1] - globalScrollPos[0] - i * 10;
    return [x, y];
  };

  const handleMouseDown = async (e) => {
    if (!draggable || e.button === 2) return;

    try {
      const { abort, promise } = store.dragUntil(10);
      _abortDragPromise = abort;
      document.addEventListener("mouseup", handleMouseUpAbort);
      await promise;

      const { offsetX, offsetY } = e;
      state = "dragging";
      store.transit(StateNames.dragging, {
        dragId: index,
        offsetPos: [offsetX, offsetY],
      });

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
    state = "idle";
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
  position: ${$store.dragIds.has(index) ? "fixed" : "absolute"};
  z-index: ${$store.dragIds.has(index) ? "10" : "1"};
  transform: translate(${$pos[0]}px, ${$pos[1]}px);
`}
  >
    <slot isDragging={$store.dragIds.has(index)} />
  </div>
{/if}

<style>
  .drag-item {
    /** do not set top/left to 0 */
    top: auto;
    left: auto;
  }
</style>
