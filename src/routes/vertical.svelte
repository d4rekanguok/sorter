<script>
    import colors from 'css-color-names'
    import { nanoid } from 'nanoid'

    import { Drag, reorder } from '$lib'
    import TemplateClick from '$components/TemplateClick.svelte'

    /**
     * @typedef Data
     * @type {object}
     * @property {string} id
     * @property {string} value
     */

    /** @type {Data[]} */
    let data = Object.keys(colors)
        .filter((_, i) => i < 1000)
        .map((color) => ({
            id: nanoid(6),
            value: color,
        }))

    /** @type {Set<string>} */
    let selected = new Set()

    const handleSelect = ({ detail }) => {
        const { id, isSelected } = detail
        if (isSelected) {
            selected.add(id)
        } else {
            selected.delete(id)
        }
        selected = selected
    }

    const handleDragEnd = ({ detail }) => {
        const { dragIds, dropIndex } = detail
        reorder(data, dragIds, dropIndex)
        data = data
    }

    const handleAdd = ({ detail }) => {
        let idx = data.length
        if (detail.id) {
            idx = data.findIndex((item) => item.id === detail.id) + 1
        }

        data.splice(idx, 0, {
            id: nanoid(6),
            value: Object.keys(colors)[data.length],
        })
        data = data
    }

    const itemDimensions = [
        [180, 100],
        [120, 120],
    ]
    let itemDimensionId = 0
    const handleChangeSize = () => {
        itemDimensionId = (itemDimensionId + 1) % itemDimensions.length
    }
</script>

<main>
    <div class="dev">
        <pre
            style="white-space: pre-wrap;">
          {Array.from(selected).map(id => data.find(item => item.id === id).value).join(', ')}
      </pre>

        <!-- <pre
          style="white-space: pre-wrap;">
          {data.map(v => v.value).join(', ')}
      </pre> -->
    </div>

    <div class="wrapper">
        <h2>Horizontal</h2>
        <button on:click={handleChangeSize}>Change Size</button>
        <Drag
            debug={true}
            strategy="vertical"
            {data}
            {selected}
            itemDimension={itemDimensions[itemDimensionId]}
            on:dragend={handleDragEnd}
            let:item
            let:index
            let:isDragging
        >
            <TemplateClick
                slot="item"
                {item}
                {index}
                {isDragging}
                isSelected={selected.has(index)}
                on:select={handleSelect}
                on:add={handleAdd}
            />
        </Drag>
        <button class="add" on:click={handleAdd}>More</button>
    </div>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    :global(body) {
        background-color: rgb(219, 227, 235);
    }

    main {
        position: relative;
        margin: 0 auto;
        padding: 50vh 0;
        max-width: 60rem;
    }

    .wrapper {
        position: relative;
        overflow: scroll;
        height: 75vh;
        width: 200px;
        border-radius: 8px;
        border: 1px solid skyblue;
    }

    .add {
        width: 100%;
        height: 28px;
        color: white;
        background-color: cornflowerblue;
        border: none;
        border-radius: 4px;
    }
</style>
