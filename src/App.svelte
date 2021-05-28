<script lang="ts">
  import colors from "css-color-names";
  import { nanoid } from "nanoid";

  import Sorter from "./lib/SorterNext.svelte";
  import DragItem from "./lib/DragItem.svelte";

  interface Data {
    id: string;
    value: string;
    label: string;
  }

  let data: Data[] = Object.keys(colors)
    .filter((_, i) => i < 20)
    .map((color) => ({
      id: nanoid(6),
      value: color,
      label: color,
    }));
</script>

<main
  on:dragover|preventDefault={() => null}
  on:drop|preventDefault={() => null}
>
  <Sorter itemDimension={[100, 30]}>
    {#each data as item, index (item.id)}
      <DragItem {index}>{item.value}</DragItem>
    {/each}
    <DragItem index={data.length} draggable={false}>
      <button>A button</button>
    </DragItem>
  </Sorter>
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
</style>
