<script lang="ts">
  import DemoWrapper from "./components/DemoWrapper.svelte";
  import DemoSimple from "./components/DemoSimple.svelte";
  import DemoMultipleSelect from "./components/DemoMultipleSelect.svelte";

  interface Data {
    id: string;
    value: string;
    label: string;
  }
  let data: Data[] = [
    { id: "a1", value: "tomato", label: "Tomato" },
    { id: "b2", value: "pink", label: "Pink" },
    { id: "c3", value: "aquamarine", label: "Aquamarine" },
    { id: "d4", value: "slateblue", label: "Slateblue" },
  ];
</script>

<main>
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
    margin: 4rem auto;
    max-width: 60rem;
  }

  pre {
    font-size: 1.25rem;
  }
</style>
