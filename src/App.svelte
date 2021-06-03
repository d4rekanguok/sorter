<script>
  import colors from "css-color-names";
  import { nanoid } from "nanoid";

  import Drag from "./lib/Drag.svelte";
  import DragItem from "./lib/DragItem.svelte";
  import DragIndicator from "./lib/DragIndicator.svelte";
  import { reorder } from "./lib/reorder";
  import Template from "./components/Template.svelte";

  /**
   * @typedef Data
   * @type {object}
   * @property {string} id
   * @property {string} value
   */

  /** @type {Data[]} */
  let data = Object.keys(colors)
    .filter((_, i) => i < 10)
    .map((color) => ({
      id: nanoid(6),
      value: color,
    }));

  /** @type {Set<string>} */
  let selected = new Set();

  const handleSelect = ({ detail }) => {
    const { id, isSelected } = detail;
    console.log(id, isSelected);
    if (isSelected) {
      selected.add(id);
    } else {
      selected.delete(id);
    }
    selected = selected;
  };

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
  <pre
    style="white-space: pre-wrap;">
    {Array.from(selected).map(id => data.find(item => item.id === id).value).join(', ')}
  </pre>

  <pre
    style="white-space: pre-wrap;">
    {data.map(v => v.value).join(', ')}
  </pre>
  <Drag itemDimension={[250, 45]} on:dragend={handleDragEnd}>
    {#each data as item, index (item.id)}
      <DragItem {index} let:isDragging>
        <Template
          {item}
          {isDragging}
          isSelected={selected.has(item.id)}
          on:select={handleSelect}
        />
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
    background-color: rgb(219, 227, 235);
  }

  main {
    position: relative;
    margin: 0 auto;
    padding: 8rem 0;
    max-width: 60rem;
  }
</style>
