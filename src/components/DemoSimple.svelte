<script lang="ts">
  export let initialData = [];
  let data = [...initialData];

  import Sorter, { reorder } from "../lib/Sorter.svelte";
  import DemoTemplate from "./DemoTemplate.svelte";

  const handleDragEnd = (e) => {
    const { from, to } = e.detail;
    reorder(data, from, to);
    count++;
  };

  let count = 0;
</script>

{#key count}
  <Sorter on:dragend={handleDragEnd} template={DemoTemplate} {data} />
{/key}
