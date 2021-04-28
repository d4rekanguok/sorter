<script lang="ts">
  import Sorter, { reorder } from "../lib/Sorter.svelte";
  import DemoTemplateSelect from "./DemoTemplateHorizontal.svelte";
  import strategy from "../lib/strategies/horizontal";

  export let initialData = [];
  let data = [...initialData];
  let selectedIds = [];

  const handleDeselect = () => {
    selectedIds = [];
  };

  const handleDragEnd = (e) => {
    const { from, to } = e.detail;
    reorder(data, from, to);
    data = data;
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

<button on:click={handleDeselect}>Deselect all</button>
<div class="demo-wrapper">
  <Sorter
    on:dragend={handleDragEnd}
    on:select={handleSelect}
    template={DemoTemplateSelect}
    {selectedIds}
    {data}
    {strategy}
  />
</div>

<style>
  button {
    border: none;
    background: transparent;
    padding: 0.25rem 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: slateblue;
  }

  .demo-wrapper {
    min-width: 18rem;
    position: relative;
    padding: 1rem;
    background-color: white;
    /* we need a fixed height for the container */
    height: 18rem;
    border-radius: 6px;
    border: 1px solid lightsteelblue;
    overflow: hidden;
    margin-bottom: 2rem;
  }
</style>
