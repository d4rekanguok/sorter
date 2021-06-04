<script>
  import { createEventDispatcher } from "svelte";

  export let item = {};
  export let index = 0;
  export let isDragging = false;
  export let isSelected = false;
  export let enableAdd = false;

  const dispatch = createEventDispatcher();

  const changeHandler = (e) =>
    dispatch("select", {
      id: item.id,
      isSelected: e.target.checked,
    });

  const addHandler = () => {
    dispatch("add", {
      id: item.id,
    });
  };

  const { value } = item;
</script>

<div class="item" style="--color: {value};" class:isDragging>
  <div>{index} {value}</div>
  <input type="checkbox" checked={isSelected} on:change={changeHandler} />

  {#if enableAdd}
    <div class="btn-add">
      <button on:click={addHandler}>Add</button>
    </div>
  {/if}
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

  .item:hover .btn-add {
    display: block;
  }

  .item.isDragging:hover .btn-add {
    display: none;
  }

  .btn-add {
    display: none;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 10%);
  }

  .btn-add button {
    border: none;
    background: pink;
    color: white;
    border-radius: 1000px;
    font-size: 12px;
    font-weight: 600;
    padding: 0.25em 0.75em;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .item.isDragging {
    box-shadow: 0 15px 20px -10px rgba(0, 0, 0, 0.25);
  }
</style>
