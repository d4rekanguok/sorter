<script lang="ts">
  import DemoTemplate from "./lib/DemoTemplate.svelte";
  import Sorter, { reorder } from "./lib/Sorter.svelte";

  interface Data {
    id: string;
    value: string;
    label: string;
  }
  let data: Data[] = [
    { id: "1", value: "tomato", label: "Tomato" },
    { id: "2", value: "pink", label: "Pink" },
    { id: "3", value: "aquamarine", label: "Aquamarine" },
    { id: "4", value: "slateblue", label: "Slateblue" },
  ];

  let count = 0;

  const handleDragEnd = (e) => {
    const { from, to } = e.detail;
    reorder(data, from, to);
    count++;
  };
</script>

<main>
  <div class="demo-wrapper">
    {#key count}
      <Sorter on:dragend={handleDragEnd} template={DemoTemplate} {data} />
    {/key}
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    position: relative;
    top: 4rem;
    left: 2rem;
  }

  .demo-wrapper {
    max-width: 320px;
  }
</style>
