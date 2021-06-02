<script>
  export let item = {};
  export let isDragging = false;

  const { value } = item;
</script>

<div class="item" style="--color: {value};" class:isDragging>
  <div>{value}</div>
  <button on:click={() => alert(value)}>Select</button>
</div>

<style>
  .item {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    padding: 0.5rem;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    background-color: white;
    border-left: 8px solid var(--color);
  }

  .item button {
    border: none;
    background: transparent;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 0.8em;
    opacity: 0.8;
  }

  .item.isDragging {
    box-shadow: 0 15px 20px -10px rgba(0, 0, 0, 0.25);
  }
</style>
