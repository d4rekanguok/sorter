<script lang="ts">
  import { measureTemplateSize as defaultTemplateMeasurer } from "./measureTemplateSize";
  import { place as defaultPlace } from "./place";
  import { onMount } from "svelte";

  import DragWrapper from "./DragWrapper.svelte";

  export let data: any[] = [];
  export let template = null;
  export let identifier = "id";
  export let measureTemplateSize = defaultTemplateMeasurer;
  export let place = defaultPlace;

  /* true when all required measurements are done */
  let ready = false;
  let templateDimension: [number, number] = [0, 0];
  let templateSample: any;

  onMount(() => {
    templateDimension = measureTemplateSize(templateSample);
    ready = true;
  });

  const handleDragStart = () => {
    console.log("start");
  };

  const handleDragEnd = () => {
    console.log("end");
  };

  const handleDrag = (e) => {
    console.log(`draggin: ${e.clientX}, ${e.clientY}`);
  };
</script>

<div
  class="wrapper"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:drag|stopPropagation={handleDrag}
>
  {#if ready}
    {#each data as item, i (item[identifier])}
      <DragWrapper position={place(i, templateDimension)}>
        <svelte:component this={template} {item} />
      </DragWrapper>
    {/each}
  {/if}

  <!-- measure element off-screen -->
  {#if !ready}
    <div class="offscreen-measurer">
      <svelte:component
        this={template}
        item={data[0]}
        bind:ref={templateSample}
      />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
  }

  .offscreen-measurer {
    position: absolute;
    width: 100%;
  }
</style>
