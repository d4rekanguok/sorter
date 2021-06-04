<script>
  import { getContext } from "svelte";
  import { key } from "./context";

  const { store } = getContext(key);
  $: y =
    $store.state === "dragging"
      ? $store.itemDimension[1] * $store.dropIndex || 0
      : 0;

  $: opacity = $store.state === "dragging" ? 1 : 0;
</script>

<div
  class="indicator-wrapper"
  style={`
    width: ${$store.itemDimension[0]}px;
    transform: translate(0px, ${y}px);
    opacity: ${opacity};
`}
>
  <slot>
    <div class="default-indicator" />
  </slot>
</div>

<style>
  .indicator-wrapper {
    position: absolute;
    pointer-events: none;
    z-index: 5;
  }
  .default-indicator {
    position: relative;
    width: 100%;
    background-color: tomato;
    height: 2px;
  }
</style>
