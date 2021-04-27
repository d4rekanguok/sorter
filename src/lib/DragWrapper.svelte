<script lang="ts">
  import type { Spring } from "svelte/motion";
  import type { Writable } from "svelte/store";
  export let parentPos: [number, number] = [0, 0];
  export let position: Spring<Record<"x" | "y" | "rotate", number>>;
  export let order = 0;
  export let zIndex: Writable<number>;
  export let isDragging: boolean;
  export let dimension = [0, 0];
  export let id: string | number = "temp";

  $: x = $position.x;
  $: y = $position.y;
  $: rotate = $position.rotate;
</script>

<div
  class="drag-wrapper"
  draggable={true}
  data-order={order}
  data-id={id}
  data-pos-x={x}
  data-pos-y={y}
  style="
    position: {isDragging ? 'fixed' : 'absolute'};
    top: {isDragging
    ? parentPos[1] + 'px'
    : 0};
    left: {isDragging
    ? parentPos[0] + 'px'
    : 0};
    width: {dimension[0]}px;
    height: {dimension[1]};
    transform:
      translate({x}px, {y}px)
      rotate({rotate}deg);
    z-index: {$zIndex}
  "
>
  <slot />
</div>
