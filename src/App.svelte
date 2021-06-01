<script lang="ts">
  import colors from "css-color-names";
  import { nanoid } from "nanoid";

  import Drag from "./lib/Drag.svelte";
  import DragItem from "./lib/DragItem.svelte";
  import DragIndicator from "./lib/DragIndicator.svelte";

  import { reorder } from "./lib/reorder";

  interface Data {
    id: string;
    value: string;
  }

  let data: Data[] = Object.keys(colors)
    .filter((_, i) => i < 20)
    .map((color) => ({
      id: nanoid(6),
      value: color,
    }));

  const handleDragEnd = ({ detail }) => {
    const { dragIds, dropIndex } = detail;
    reorder(data, dragIds, dropIndex);
    data = data;
  };

  const handleAdd = () => {
    data.push({
      id: nanoid(6),
      value: Object.keys(colors)[data.length],
    });
    data = data;
  };
</script>

<main
  on:dragover|preventDefault={() => null}
  on:drop|preventDefault={() => null}
>
  <Drag itemDimension={[100, 30]} on:dragend={handleDragEnd}>
    {#each data as item, index (item.id)}
      <DragItem {index}>
        <div class="item" style="--color: {item.value};">{item.value}</div>
      </DragItem>
    {/each}
    <DragIndicator />
    <DragItem index={data.length} draggable={false}>
      <button on:click={handleAdd}>A button</button>
    </DragItem>
  </Drag>
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

  .item {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: var(--color);
  }
</style>
