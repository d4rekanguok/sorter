<script lang="ts">
  export let order = 0;
  export let isDragging = false;
  export let item = {
    value: "black",
    label: "Black",
  };
</script>

<div class="template" class:isDragging style={`--theme: ${item.value}`}>
  <span class="number">{order + 1}</span>
  <span>
    {item.label}
  </span>
</div>

<style>
  .template {
    position: relative;
    width: 100%;
    padding: 1rem;
    margin: 0.25rem 0;
    background-color: var(--theme);
    border-radius: 4px;
    display: flex;
    gap: 0.5rem;
    align-items: center;
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
