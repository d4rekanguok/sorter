<script lang="ts">
  import DemoTemplate from "./lib/DemoTemplate.svelte";
  import Sorter from "./lib/Sorter.svelte";

  interface Data {
    id: string;
    value: string;
    label: string;
  }
  const data: Data[] = [
    { id: "1", value: "tomato", label: "Tomato" },
    { id: "2", value: "pink", label: "Pink" },
    { id: "3", value: "aquamarine", label: "Aquamarine" },
    { id: "4", value: "slateblue", label: "Slateblue" },
  ];
</script>

<main>
  <div class="demo-wrapper">
    <Sorter template={DemoTemplate} {data} />
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
