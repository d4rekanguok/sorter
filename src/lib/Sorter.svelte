<script context="module">
  import { reorder as moduleReorder } from "./reorder";
  export const reorder = moduleReorder;
</script>

<script lang="ts">
  import { measureTemplateSize as defaultTemplateMeasurer } from "./measureTemplateSize";
  import { place as defaultPlace, unplace as defaultUnplace } from "./place";
  import { setDataImage, measureContainer, getDragOffset } from "./domHelpers";
  import { onMount, createEventDispatcher } from "svelte";

  import DragWrapper from "./DragWrapper.svelte";

  export let data: any[] = [];
  export let template = null;
  export let identifier = "id";
  export let measureTemplateSize = defaultTemplateMeasurer;
  export let place = defaultPlace;
  export let unplace = defaultUnplace;

  /* true when all required measurements are done */
  let ready = false;
  let templateDimension: [number, number] = [0, 0];
  let containerDimension: DOMRect;
  let dragOffset: [number, number] = [0, 0];

  let templateSample: any;
  let containerRef: HTMLDivElement = null;
  let itemRefs: Record<string, HTMLElement> = {};
  let markerRef: HTMLElement = null;

  let orderedIds: Array<string | number> = data.map((item) => item[identifier]);
  let draggingIds: Array<string | number> = [];
  let dropOrderId: number = 0;

  const dispatch = createEventDispatcher();

  onMount(() => {
    templateDimension = measureTemplateSize(templateSample);
    containerDimension = measureContainer(containerRef);
    ready = true;
  });

  const handleDragStart = (e) => {
    const { clientX, clientY } = e;
    const itemEl = e.target as HTMLElement;
    if (!itemEl) return;

    setDataImage(e);

    // calculate offset so the dragged item move seamlessly with the cursor
    const itemX = +itemEl.dataset.posX;
    const itemY = +itemEl.dataset.posY;
    dragOffset = getDragOffset([clientX, clientY], [itemX, itemY]);

    const item = e.target as HTMLElement;
    const order = +item.dataset.order;
    draggingIds = orderedIds.splice(order, 1);
    orderedIds = [...orderedIds];
    draggingIds = [...draggingIds];
  };

  const handleDragEnd = () => {
    // orderedIds.splice(dropOrderId, 0, ...draggingIds);
    // orderedIds = [...orderedIds];
    // draggingIds = [];
    const draggingIndexes = draggingIds.map((id) =>
      data.findIndex((item) => item[identifier] === id)
    );
    dispatch("dragend", {
      from: draggingIndexes,
      to: dropOrderId,
    });
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
      const itemEl = itemRefs[id];
      itemEl.style.zIndex = 1000 + i + "";
      itemEl.style.transform = `
        translate(${clientX - offsetX}px, ${clientY - offsetY}px)
        rotate(${5 * i}deg)`;
    });

    // move other items around
    orderedIds.forEach((id, i) => {
      const [x, y] = place(i, templateDimension);
      const itemEl = itemRefs[id];
      itemEl.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  const handleDrop = (e) => {
    console.log("dropped");
  };

  $: isDragging = draggingIds.length > 0;
</script>

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
        bind:ref={itemRefs[item[identifier]]}
        position={place(i, templateDimension)}
        id={item[identifier]}
        order={i}
      >
        <svelte:component
          this={template}
          {item}
          order={i}
          isDragging={draggingIds.includes(item[identifier])}
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
      <DragWrapper bind:ref={templateSample}>
        <svelte:component this={template} item={data[0]} />
      </DragWrapper>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
  }

  .offscreen-measurer {
    opacity: 0;
  }

  .target-marker {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: red;
  }
</style>
