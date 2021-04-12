<script lang="ts">
  export let item = {
    value: "black",
    label: "Black",
  };
</script>

<div class="template" style={`--theme: ${item.value}`}>
  {item.label}
</div>

<style>
  .template {
    position: relative;
    width: 100%;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background-color: var(--theme);
    border-radius: 4px;
  }
</style>
