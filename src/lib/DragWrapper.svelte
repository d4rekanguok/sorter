<script lang="ts">
  export let position = [0, 0];
  const [x, y] = position;
</script>

<div
  class="drag-wrapper"
  draggable={true}
  style={`transform: translate(${x}px, ${y}px)`}
>
  <slot />
</div>

<style>
  .drag-wrapper {
    position: absolute;
    width: 100%;
  }
</style>
