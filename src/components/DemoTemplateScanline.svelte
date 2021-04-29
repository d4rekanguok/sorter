<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let order = 0;
  export let isDragging = false;
  export let isSelected = false;
  export let item = {
    id: "0",
    value: "black",
    label: "Black",
  };

  const dispatch = createEventDispatcher();
  const handleChange = (e) => {
    dispatch("select", {
      checked: e.target.checked,
      item,
    });
  };

  const id = "sl-" + item.value;
</script>

<div class="template" class:isDragging style={`--theme: ${item.value}`}>
  <label class="label" for={id}>
    <span class="number">{order + 1}</span>
    <span>
      {item.label}
    </span>
  </label>
  <input {id} type="checkbox" checked={isSelected} on:change={handleChange} />
</div>

<style>
  .template {
    position: relative;
    width: 12rem;
    padding: 1rem;
    margin: 0.25rem;
    background-color: var(--theme);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    text-shadow: 1px 1px 0 white;
  }

  .template.isDragging {
    box-shadow: 0 6px 12px -5px rgba(0, 0, 0, 0.3),
      0 12px 24px -10px rgba(0, 0, 0, 0.2);
  }
  .number {
    font-family: monospace;
    opacity: 0.5;
    font-weight: 600;
  }
</style>
