<script lang="ts">
  import Sorter, { reorder } from "../lib/Sorter.svelte";
  import DemoTemplateSelect from "./DemoTemplateSelect.svelte";

  export let initialData = [];
  let data = [...initialData];
  let selectedIds = [];
  let count = 0;

  const handleDragEnd = (e) => {
    const { from, to } = e.detail;
    reorder(data, from, to);
    count++;
  };

  const handleSelect = (e) => {
    const { item, checked } = e.detail;
    const id = item.id;
    if (checked) {
      selectedIds.push(id);
    } else {
      const idx = selectedIds.indexOf(id);
      selectedIds.splice(idx, 1);
    }
    selectedIds = [...selectedIds];
  };
</script>

{#key count}
  <Sorter
    on:dragend={handleDragEnd}
    on:select={handleSelect}
    template={DemoTemplateSelect}
    {selectedIds}
    {data}
  />
{/key}
