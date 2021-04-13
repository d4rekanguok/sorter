<script lang="ts">
  import type { Spring } from "svelte/motion";
  import type { Writable } from "svelte/store";
  export let ref: HTMLElement;
  export let position: Spring<Record<"x" | "y" | "rotate", number>>;
  export let order = 0;
  export let zIndex: Writable<number>;
  export let id: string | number = "temp";

  $: x = $position.x;
  $: y = $position.y;
  $: rotate = $position.rotate;
</script>

<div
  bind:this={ref}
  class="drag-wrapper"
  draggable={true}
  data-order={order}
  data-id={id}
  data-pos-x={x}
  data-pos-y={y}
  style="transform: translate({x}px, {y}px) rotate({rotate}deg); z-index: {$zIndex}"
>
  <slot />
</div>

<style>
  .drag-wrapper {
    position: absolute;
    width: 100%;
  }
</style>
