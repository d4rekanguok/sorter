<script lang="ts">
  export let layout: "stack" | "row" = "row";
</script>

<div class="container" data-layout={layout}>
  <div class="demo-wrapper">
    <slot name="sorter" />
  </div>
  <div class="description">
    <slot name="desc" />
  </div>
</div>

<style>
  .container {
    position: relative;
    margin-bottom: 4rem;
    border-bottom: 1px solid gainsboro;
  }

  @media (min-width: 18rem) {
    .container[data-layout="row"] {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .description {
      flex: 1 1 auto;
    }
  }

  .container[data-layout="stack"] .description {
    margin-bottom: 2rem;
  }
</style>
