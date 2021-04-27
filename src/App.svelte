<script lang="ts">
  import colors from "css-color-names";
  import { nanoid } from "nanoid";
  import DemoWrapper from "./components/DemoWrapper.svelte";
  import DemoSimple from "./components/DemoSimple.svelte";
  import DemoMultipleSelect from "./components/DemoMultipleSelect.svelte";

  interface Data {
    id: string;
    value: string;
    label: string;
  }

  let data: Data[] = Object.keys(colors).map((color) => ({
    id: nanoid(6),
    value: color,
    label: color,
  }));
</script>

<main on:drop|preventDefault={() => null}>
  <DemoWrapper>
    <DemoSimple initialData={data} slot="sorter" />
    <svelte:fragment slot="desc">
      <h1>Simple List</h1>
      <pre>
        {
`<Sorter
  on:dragend={handleDragEnd}
  template={DemoTemplate}
  {data}
/>`
        }
      </pre>
    </svelte:fragment>
  </DemoWrapper>

  <DemoWrapper>
    <DemoMultipleSelect initialData={data} slot="sorter" />
    <svelte:fragment slot="desc">
      <h1>Multiple Drag</h1>
      <pre>
        {
`<Sorter
  on:dragend={handleDragEnd}
  template={DemoTemplate}
  {data}
/>`
        }
      </pre>
    </svelte:fragment>
  </DemoWrapper>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global(body) {
    background-color: aliceblue;
  }

  main {
    position: relative;
    margin: 0 auto;
    padding: 8rem 0;
    max-width: 60rem;
  }

  pre {
    font-size: 1.25rem;
  }
</style>
