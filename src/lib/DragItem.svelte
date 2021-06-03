<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { key } from "./context";
  import { isEqualSet } from "./compare-set";

  export let index = 0;
  export let draggable = true;
  export let isSelected = false;

  /** @type {number} temporary index while in drag state */
  let nextIndex = index;

  let isBeingDragged = false;
  let offset = [0, 0];
  let _dragIds = new Set();

  const pos = spring([0, 0], {
    stiffness: 0.1,
    damping: 0.4,
  });

  const { store, dragEnd } = getContext(key);

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

    if (nextIndex !== index && $store.state === "idle") {
      nextIndex = index;
    }
  }

  $: {
    if ($store.state === "dragging" && (isBeingDragged || isSelected)) {
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
      await store.dragUntil(10);
      const { offsetX, offsetY } = e;
      offset = [offsetX, offsetY];
      isBeingDragged = true;
      store.transition("dragging", { dragId: index });

      document.addEventListener("mouseup", handleMouseUp);
    } catch (e) {
      return;
    }
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
