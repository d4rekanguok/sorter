<script>
    import { createEventDispatcher } from 'svelte'

    export let item = {}
    export let index = 0
    export let isDragging = false
    export let isSelected = false
    let isTainted = false

    const dispatch = createEventDispatcher()

    const changeHandler = (e) =>
        dispatch('select', {
            id: item.id,
            isSelected: e.target.checked,
        })

    const { value } = item
</script>

<div
    class="item"
    style="--color: {value};"
    data-tainted={isTainted}
    class:isDragging
    on:mouseup={() => (isTainted = true)}
>
    <div>{index + 1} {value}</div>
    <input type="checkbox" checked={isSelected} on:change={changeHandler} />
</div>

<style>
    .item {
        position: relative;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        display: flex;
        padding: 0.5rem;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        background-color: white;
        border-left: 8px solid var(--color);
    }

    .item.isDragging {
        box-shadow: 0 15px 20px -10px rgba(0, 0, 0, 0.25);
    }

    .item[data-tainted='true'] {
        background-color: purple;
    }
</style>
