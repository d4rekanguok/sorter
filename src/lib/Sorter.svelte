<script context="module">
  import { reorder as moduleReorder } from "./reorder";
  export const reorder = moduleReorder;
</script>

<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { spring } from "svelte/motion";
  import type { Spring } from "svelte/motion";
  import { measureTemplateSize as defaultTemplateMeasurer } from "./measureTemplateSize";
  import { place as defaultPlace, unplace as defaultUnplace } from "./place";
  import { setDataImage, measureContainer, getDragOffset } from "./domHelpers";
  import { removeItemsFromArray } from "./removeItems";

  import DragWrapper from "./DragWrapper.svelte";

  export let data: any[] = [];
  export let selectedIds: Array<string | number> = [];
  export let template = null;
  export let identifier = "id";
  export let measureTemplateSize = defaultTemplateMeasurer;
  export let place = defaultPlace;
  export let unplace = defaultUnplace;

  /* true when all required measurements are done */
  let ready = false;
  let templateDimension: [number, number];
  let containerDimension: DOMRect;
  let dragOffset: [number, number] = [0, 0];
  let scrollPos: [number, number] = [0, 0];

  let templateSample: any;
  let containerRef: HTMLDivElement = null;
  let markerRef: HTMLElement = null;

  let orderedIds: Array<string | number> = data.map((item) => item[identifier]);
  let draggingIds: Array<string | number> = [];
  let dropOrderId: number = 0;

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
      const [x, y] = templateDimension ? place(i, templateDimension) : [0, 0];

      itemPoses[id] = {
        zIndex: writable(10),
        pos: createPos({ x, y, rotate: 0 }),
      };

      return itemPoses;
    }, {});
  };

  $: itemPoses = setPositionAll(data, templateDimension, place, identifier);

  const dispatch = createEventDispatcher();

  onMount(() => {
    templateDimension = measureTemplateSize(templateSample);
    containerDimension = measureContainer(containerRef);
    ready = true;
  });

  const handleDragStart = (e) => {
    const itemEl = e.target as HTMLElement;
    if (!itemEl) return;

    setDataImage(e);

    // calculate offset so the dragged item move seamlessly with the cursor
    const { clientX, clientY } = e;
    // const [scrollX, scrollY] = scrollPos;

    const itemX = +itemEl.dataset.posX;
    const itemY = +itemEl.dataset.posY;
    dragOffset = getDragOffset([clientX, clientY], [itemX, itemY]);

    const item = e.target as HTMLElement;
    const order = +item.dataset.order;

    const selectedIndexes = selectedIds.map((id) => orderedIds.indexOf(id));
    const draggingIndexes = [...new Set([order].concat(selectedIndexes))];
    draggingIds = removeItemsFromArray(orderedIds, draggingIndexes);
    orderedIds = orderedIds;
  };

  const handleDragEnd = () => {
    orderedIds.splice(dropOrderId, 0, ...draggingIds);

    // reset order
    orderedIds.forEach((id, i) => {
      const [x, y] = place(i, templateDimension);
      const { zIndex, pos } = itemPoses[id];
      pos.set({ x, y, rotate: 0 });
      zIndex.set(10);
    });

    const draggingIndexes = draggingIds.map((id) =>
      data.findIndex((item) => item[identifier] === id)
    );
    draggingIds = [];

    /* how can we reduce duplicate reset work & avoid using setTimeout? */
    setTimeout(() => {
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
    const x = clientX - cx;
    const y = clientY - cy;

    // calculate potential drop index
    dropOrderId = unplace([x, y], templateDimension, [0, orderedIds.length]);

    // bring the marker to the potential drop position
    if (markerRef) {
      const [x, y] = place(dropOrderId, templateDimension);
      markerRef.style.transform = `translate(${x}px, ${y}px)`;
    }

    // stick items being dragged to the cursor
    draggingIds.forEach((id, i) => {
      const [offsetX, offsetY] = dragOffset;
      const { pos, zIndex } = itemPoses[id];
      pos.set({
        x: clientX - offsetX,
        y: clientY - offsetY,
        rotate: 5 * i,
      });
      zIndex.set(100 - i);
    });

    // move other items around
    orderedIds.forEach((id, i) => {
      const [x, y] = place(i, templateDimension);

      const { pos } = itemPoses[id];
      pos.set({
        x,
        y,
        rotate: 0,
      });
    });
  };

  const handleDrop = (e) => {
    console.log("dropped");
  };

  const handleScroll = () => {
    scrollPos = [window.scrollX, window.scrollY];
    containerDimension = measureContainer(containerRef);
  };

  $: isDragging = draggingIds.length > 0;
</script>

<svelte:window on:scroll={handleScroll} />
<div
  class="wrapper"
  bind:this={containerRef}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:dragover|preventDefault={() => null}
  on:drag|stopPropagation={handleDrag}
  on:drop|preventDefault={handleDrop}
>
  {#if ready}
    {#each data as item, i (item[identifier])}
      <DragWrapper
        dimension={templateDimension}
        position={itemPoses[item[identifier]].pos}
        id={item[identifier]}
        zIndex={itemPoses[item[identifier]].zIndex}
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
  {/if}

  {#if isDragging}
    <div bind:this={markerRef} class="target-marker" />
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
  }

  .offscreen-measurer {
    opacity: 0;
  }

  .target-marker {
    position: absolute;
    top: -1px;
    width: 100%;
    height: 2px;
    background-color: pink;
  }

  .measurer {
    position: absolute;
    width: 100%;
  }
</style>
