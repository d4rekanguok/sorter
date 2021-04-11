<script lang="ts">
  import DemoTemplate from "./lib/DemoTemplate.svelte";
  import Sorter from "./lib/Sorter.svelte";
</script>

<main>
  <div class="demo-wrapper">
    <Sorter>
      <DemoTemplate item={{ value: "blue", label: "blue" }} />
    </Sorter>
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
