<script lang="ts">
  export let initialData = [];
  let data = [...initialData];

  import Sorter, { reorder } from "../lib/Sorter.svelte";
  import DemoTemplate from "./DemoTemplate.svelte";

  const handleDragEnd = (e) => {
    const { from, to } = e.detail;
    data = reorder(data, from, to);
  };
</script>

<!-- {#key count} -->
<Sorter on:dragend={handleDragEnd} template={DemoTemplate} {data} />
<!-- {/key} -->
