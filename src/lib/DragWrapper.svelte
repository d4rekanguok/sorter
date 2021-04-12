<script lang="ts">
  export let ref: HTMLElement;
  export let position = [0, 0];
  export let order = 0;
  export let id: string | number = "temp";
  const [x, y] = position;
</script>

<div
  bind:this={ref}
  class="drag-wrapper"
  draggable={true}
  data-order={order}
  data-id={id}
  data-pos-x={x}
  data-pos-y={y}
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
