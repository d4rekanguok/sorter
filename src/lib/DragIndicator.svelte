<script>
  import { getContext } from "svelte";
  import { key } from "./context";

  const { store } = getContext(key);
  $: y = $store.isDragging
    ? $store.itemDimension[1] * $store.dropIndex || 0
    : 0;
</script>

<div
  style={`
    position: relative;
    pointer-events: none;
    z-index: 5;
    transform: translate(0px, ${y}px);
    opacity: ${$store.isDragging ? 1 : 0};
`}
>
  <slot>
    <div class="default-indicator" />
  </slot>
</div>

<style>
  .default-indicator {
    position: absolute;
    width: 100%;
    background-color: tomato;
    height: 2px;
  }
</style>
