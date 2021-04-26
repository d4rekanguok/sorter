<div class="container">
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
  }

  @media (min-width: 18rem) {
    .container {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .description {
      flex: 1 1 auto;
    }
  }

  .demo-wrapper {
    min-width: 18rem;
    position: relative;
    padding: 1rem;
    background-color: white;
    /* we need a fixed height for the container */
    height: 45vh;
    border-radius: 6px;
    border: 1px solid lightsteelblue;
    overflow: hidden;
  }
</style>
