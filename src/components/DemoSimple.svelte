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

<div class="demo-wrapper">
  <Sorter
    on:dragend={handleDragEnd}
    template={DemoTemplate}
    {data}
    templateProps={{ foo: "bar" }}
  />
</div>

<style>
  .demo-wrapper {
    min-width: 18rem;
    position: relative;
    padding: 1rem;
    background-color: white;
    /* we need a fixed height for the container */
    height: 45vh;
    border-radius: 6px;
    border: 1px solid lightsteelblue;
    overflow: hidden;
    margin-bottom: 2rem;
  }
</style>
