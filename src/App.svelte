<script lang="ts">
  import DemoTemplate from "./lib/DemoTemplate.svelte";
  import Sorter from "./lib/Sorter.svelte";

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
    const froms = from.flatMap((index, i) => data.splice(index + i, 1));
    data.splice(to, 0, ...froms);
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

  .demo-wrapper {
    max-width: 320px;
  }
</style>
