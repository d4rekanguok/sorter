<script lang="ts">
  import { measureTemplateSize as defaultTemplateMeasurer } from "./measureTemplateSize";
  import { place as defaultPlace, unplace as defaultUnplace } from "./place";
  import { setDataImage } from "./domHelpers";
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
  let templateSample: any;

  let orderedIds: Array<string | number> = data.map((item) => item[identifier]);
  let draggingIds: Array<string | number> = [];
  let itemRefs: Record<string, HTMLElement> = {};
  let dropOrderId: number = 0;

  const dispatch = createEventDispatcher();

  onMount(() => {
    templateDimension = measureTemplateSize(templateSample);
    ready = true;
  });

  const handleDragStart = (e) => {
    setDataImage(e);

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
    console.log({ dragend: true, dropOrderId });
    dispatch("dragend", {
      from: draggingIndexes,
      to: dropOrderId,
    });
  };

  const handleDrag = (e) => {
    const { clientX, clientY } = e;
    if (clientX === 0 || clientY === 0) return;
    dropOrderId = unplace([clientX, clientY], templateDimension);

    orderedIds.forEach((id, i) => {
      const [x, y] = place(i, templateDimension);
      const itemEl = itemRefs[id];
      itemEl.style.transform = `translate(${x}px, ${y}px)`;
    });

    draggingIds.forEach((id, i) => {
      const itemEl = itemRefs[id];
      itemEl.style.zIndex = 1000 + i + "";
      itemEl.style.transform = `
        translate(${clientX}px, ${clientY}px)
        rotate(${5 * i}deg)`;
    });
  };

  const handleDrop = (e) => {
    console.log("dropped");
  };
</script>

<div
  class="wrapper"
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
        <svelte:component this={template} {item} />
      </DragWrapper>
    {/each}
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
</style>
