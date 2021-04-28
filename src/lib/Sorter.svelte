<script context="module">
  import { reorder as moduleReorder } from "./reorder";
  export const reorder = moduleReorder;
</script>

<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { Spring } from "svelte/motion";
  import { onMount, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { spring } from "svelte/motion";
  import { measureTemplateSize as defaultTemplateMeasurer } from "./measureTemplateSize";
  import strategyVertical from "./strategies/vertical";
  import { setDataImage, measureContainer } from "./domHelpers";
  import { removeItemsFromArray } from "./removeItems";
  import { createAutoScrollStore, detectScrollZone } from "./autoScroll";

  import DragWrapper from "./DragWrapper.svelte";

  export let data: any[] = [];
  export let selectedIds: Array<string | number> = [];
  export let template = null;
  export let identifier = "id";
  export let strategy = strategyVertical;
  export let measureTemplateSize = defaultTemplateMeasurer;
  const {
    place,
    unplace,
    getContainerMaxDimension,
    setWrapperStyle,
    setMarkerStyle,
    autoScroll = () => null,
  } = strategy;

  /* true when all required measurements are done */
  let ready = false;
  let templateDimension: [number, number];
  let containerDimension: DOMRect;
  let scrollPos = createAutoScrollStore();
  let offsetPos: [number, number] = [0, 0];
  let maxDimension: [number, number];

  let templateSample: HTMLDivElement;
  let containerRef: HTMLDivElement = null;
  let markerRef: HTMLElement = null;

  let orderedIds: Array<string | number> = data.map((item) => item[identifier]);
  let draggingIds: Array<string | number> = [];
  let dropOrderId: number = 0;

  let dragCompleted = true;
  /* use a timer to cancel final on:dragend event, if a new drag event starts */
  let timer = null;

  type PosStore = Record<"x" | "y" | "rotate", number>;

  const createPos = (
    value: PosStore,
    config = {
      stiffness: 0.1,
      damping: 0.4,
    }
  ) => {
    return spring(value, config);
  };

  const setPositionAll = (
    data,
    templateDimension,
    place,
    identifier
  ): Record<string, { pos: Spring<PosStore>; zIndex: Writable<number> }> => {
    return data.reduce((itemPoses, item, i) => {
      const id = item[identifier];
      const [x, y] = templateDimension
        ? place({
            dragItemIndex: i,
            dimension: templateDimension,
          })
        : [0, 0];

      itemPoses[id] = {
        zIndex: writable(1),
        pos: createPos({ x, y, rotate: 0 }),
      };

      return itemPoses;
    }, {});
  };

  $: itemPoses = setPositionAll(data, templateDimension, place, identifier);

  const handleAutoScroll = ([x, y]) => {
    if (!containerRef) return;
    containerRef.scrollTop = y;
    containerRef.scrollLeft = x;
  };

  $: isDragging = draggingIds.length > 0;
  $: handleAutoScroll($scrollPos);
  $: console.log({ containerDimension, templateDimension });

  $: if (containerDimension && templateDimension && data) {
    offsetPos = [
      containerDimension.left - $scrollPos[0],
      containerDimension.top - $scrollPos[1],
    ];

    maxDimension = getContainerMaxDimension(data.length, templateDimension);
  }

  const dispatch = createEventDispatcher();

  onMount(() => {
    templateDimension = measureTemplateSize(templateSample);
    containerDimension = measureContainer(containerRef);

    ready = true;
  });

  const handleDragStart = (e) => {
    clearTimeout(timer);
    dragCompleted = false;

    orderedIds = data.map((item) => item[identifier]);
    const itemEl = e.target as HTMLElement;
    if (!itemEl) return;

    setDataImage(e);

    const item = e.target as HTMLElement;
    const order = +item.dataset.order;

    const selectedIndexes = selectedIds.map((id) => orderedIds.indexOf(id));
    const draggingIndexes = [...new Set([order].concat(selectedIndexes))];
    draggingIds = removeItemsFromArray(orderedIds, draggingIndexes);
    orderedIds = orderedIds;
  };

  const handleDragEnd = () => {
    // make sure autoscroll stops
    scrollPos.stop();

    orderedIds.splice(dropOrderId, 0, ...draggingIds);
    orderedIds = orderedIds;

    // reset order
    orderedIds.forEach((id, i) => {
      const [x, y] = place({
        dragItemIndex: i,
        dimension: templateDimension,
      });
      const { zIndex, pos } = itemPoses[id];
      pos.set({ x, y, rotate: 0 });
      zIndex.set(1);
    });

    const draggingIndexes = draggingIds.map((id) =>
      data.findIndex((item) => item[identifier] === id)
    );

    dragCompleted = true;

    /* how can we reduce duplicate reset work & avoid using setTimeout? */
    timer = setTimeout(() => {
      draggingIds = [];

      dispatch("dragend", {
        from: draggingIndexes,
        to: dropOrderId,
      });
    }, 400);
  };

  const handleDrag = (e) => {
    const { clientX, clientY } = e;
    if (clientX === 0 || clientY === 0) return;

    const { left: cx, top: cy } = containerDimension;
    const [sx, sy] = $scrollPos;
    const x = clientX - cx + sx;
    const y = clientY - cy + sy;

    const { direction, axis } = detectScrollZone(
      [clientX, clientY],
      containerDimension,
      20
    );

    autoScroll({ axis, direction, scrollPos, bound: [
      0, 0, ...maxDimension
    ] });

    // calculate potential drop index
    dropOrderId = unplace({
      position: [x, y],
      dimension: templateDimension,
      containerDimension,
      scrollPosition: $scrollPos,
      length: orderedIds.length,
    });

    // bring the marker to the potential drop position
    if (markerRef) {
      const [x, y] = place({
        dragItemIndex: dropOrderId,
        dimension: templateDimension,
      });
      markerRef.style.transform = `translate(${x}px, ${y}px)`;
    }

    // stick items being dragged to the cursor
    draggingIds.forEach((id, i) => {
      const { pos, zIndex } = itemPoses[id];
      pos.set({
        x: x - 25,
        y: y - 25,
        rotate: 5 * i,
      });
      zIndex.set(100 - i);
    });

    // move other items around
    orderedIds.forEach((id, i) => {
      const [x, y] = place({
        dragItemIndex: i,
        dimension: templateDimension,
      });

      const { pos } = itemPoses[id];
      pos.set({
        x,
        y,
        rotate: 0,
      });
    });
  };

  const handleWindowScroll = () => {
    containerDimension = measureContainer(containerRef);
  };

  const handleManualScroll = () => {
    if (!containerRef) return;
    const y = containerRef.scrollTop;
    const x = containerRef.scrollLeft;

    scrollPos.set([x, y]);
  };
</script>

<svelte:window on:scroll={handleWindowScroll} />
<div
  class="wrapper"
  style={setWrapperStyle()}
  bind:this={containerRef}
  on:scroll={handleManualScroll}
>
  {#if ready}
    <div
      class="scroll-wrapper"
      style="width: {maxDimension[0]}px; height: {maxDimension[1]}px;"
      on:dragstart={handleDragStart}
      on:dragend={handleDragEnd}
      on:drag|stopPropagation={handleDrag}
      on:drop|preventDefault={() => null}
      on:dragover|preventDefault={() => null}
    >
      {#each data as item, i (item[identifier])}
        <DragWrapper
          dimension={templateDimension}
          position={itemPoses[item[identifier]].pos}
          id={item[identifier]}
          zIndex={itemPoses[item[identifier]].zIndex}
          parentPos={offsetPos}
          draggable={dragCompleted}
          isDragging={draggingIds.includes(item[identifier])}
          order={i}
        >
          <svelte:component
            this={template}
            {item}
            order={i}
            isDragging={draggingIds.includes(item[identifier])}
            isSelected={selectedIds.includes(item[identifier])}
            on:select
          />
        </DragWrapper>
      {/each}
    </div>
  {/if}

  {#if isDragging}
    <div bind:this={markerRef} class="target-marker" style={setMarkerStyle()} />
  {/if}

  <!-- measure element off-screen -->
  {#if !ready}
    <div class="offscreen-measurer">
      <div class="measurer" bind:this={templateSample}>
        <svelte:component this={template} item={data[0]} />
      </div>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .wrapper::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  .wrapper::-webkit-scrollbar-track {
    background: transparent;
  }

  .wrapper::-webkit-scrollbar-thumb {
    background-color: pink;
    border-radius: 100px;
  }

  .scroll-wrapper {
    position: relative;
  }

  .offscreen-measurer {
    opacity: 0;
  }

  .target-marker {
    position: absolute;
  }

  .measurer {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
