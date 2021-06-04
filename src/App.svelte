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

  const handleAdd = ({ detail }) => {
    let idx = data.length;
    if (detail.id) {
      idx = data.findIndex((item) => item.id === detail.id) + 1;
    }

    data.splice(idx, 0, {
      id: nanoid(6),
      value: Object.keys(colors)[data.length],
    });
    data = data;
  };
</script>

<main>
  <div class="dev">
    <pre
      style="white-space: pre-wrap;">
    {Array.from(selected).map(id => data.find(item => item.id === id).value).join(', ')}
  </pre>

    <pre
      style="white-space: pre-wrap;">
    {data.map(v => v.value).join(', ')}
  </pre>
  </div>

  <div class="drag">
    <Drag
      size={data.length}
      itemDimension={[250, 45]}
      on:dragend={handleDragEnd}
    >
      {#each data as item, index (item.id)}
        <DragItem {index} isSelected={selected.has(item.id)} let:isDragging>
          <Template
            {item}
            {index}
            {isDragging}
            isSelected={selected.has(item.id)}
            on:select={handleSelect}
            on:add={handleAdd}
          />
        </DragItem>
      {/each}
      <DragIndicator />
      <DragItem index={data.length} draggable={false}>
        <button class="add" on:click={handleAdd}>More</button>
      </DragItem>
    </Drag>
  </div>
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

  .add {
    width: 100%;
    height: 28px;
    color: white;
    background-color: cornflowerblue;
    border: none;
    border-radius: 4px;
  }

  .dev {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
  }

  :global(.drag) {
    width: 100%;
    height: 400px;
  }
</style>
