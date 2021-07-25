<script>
    import { setContext, onMount, createEventDispatcher } from 'svelte'
    import { derived } from 'svelte/store'
    import { key, createStore, DragStates } from './context'
    import { getVisibleRect } from './getVisibleRect'
    import { defaultStrategies } from './strategies'
    import { isOverlapped } from './intersect'
    import { scroll } from './autoScroll'

    import DragItem from './DragItem.svelte'
    import DragIndicator from './DragIndicator.svelte'

    const dispatch = createEventDispatcher()

    /** @type {Drag.Dimension} [width, height] */
    export let itemDimension = [0, 0]
    export let debug = false
    export let data = []
    export let selected = []
    let className = ''
    export { className as class }
    export let strategy = 'vertical'

    const _strategy =
        typeof strategy === 'string' ? defaultStrategies[strategy] : strategy

    const {
        unplace,
        getContainerMaxDimension,
        checkVisibility,
        getAutoScrollZone,
    } = _strategy

    /** @type {HTMLDivElement} */
    export let ref

    /** @type {HTMLDivElement} Scroll wrapper */
    export let scrollWrapperRef

    const store = createStore()
    const dropIndex = derived(store, (_store) => {
        return _store.dragIds.size > 0
            ? unplace({
                  position: _store.pos,
                  dimension: _store.itemDimension,
                  containerDimension: _store.wd,
                  length: data.length,
              })
            : null
    })

    const dragEnd = () => {
        const { dragIds } = $store
        dispatch('dragend', {
            cancelled: false,
            dropIndex: $dropIndex,
            dragIds: Array.from(dragIds).sort((a, b) => a - b),
        })

        store.transit(DragStates.idle)
    }

    let maxDimension
    $: {
        maxDimension = getContainerMaxDimension({
            size: data.length,
            templateDimension: itemDimension,
        })
        // scrollPos.setScrollBound([0, 0, maxDimension[0], maxDimension[1]])
    }

    setContext(key, {
        store,
        dragEnd,
        dropIndex,
        debug,
        strategy: _strategy,
    })

    $: $store.itemDimension = itemDimension

    $: {
        let selectedIndex = new Set()
        selected.forEach((itemId) => {
            const index = data.findIndex((item) => item.id === itemId)
            selectedIndex.add(index)
        })
        $store.selectedIds = selectedIndex
    }

    $: detectAutoScroll($store)

    onMount(() => {
        recalculateDimensions()
        $store.originWd = {
            top: $store.wd.top + window.scrollY,
            left: $store.wd.left + window.scrollX,
        }
        $store.itemDimension = itemDimension
        $store.ready = true
    })

    const shouldRender = (index, store) => {
        const { ready, dragIds, selectedIds, visibleIdRange } = store
        return (
            ready &&
            (dragIds.has(index) ||
                selectedIds.has(index) ||
                (index <= visibleIdRange[1] + selectedIds.size &&
                    index >= visibleIdRange[0]))
        )
    }

    const handleMove = (e) => {
        const { clientX, clientY } = e
        $store.pos = [clientX, clientY]
    }

    const recalculateDimensions = () => {
        const rect = ref.getBoundingClientRect()
        const visibleRect = getVisibleRect(ref, rect)
        const { itemDimension } = $store
        $store.wd = rect
        $store.visibleRect = visibleRect
        $store.visibleIdRange = checkVisibility({
            wd: rect,
            itemDimension,
            visibleRect,
        })
    }

    const detectAutoScroll = (store) => {
        const { pos, visibleRect } = store
        if (
            !visibleRect ||
            store.state !== DragStates.dragging ||
            !getAutoScrollZone
        ) {
            return
        }
        const { axis, delta } = getAutoScrollZone({
            pos,
            visibleRect,
            isOverlapped,
        })

        if (delta !== 0 && scrollWrapperRef) {
            scroll(scrollWrapperRef, axis, delta, store)
        }
    }

    store.on('dragging', () => recalculateDimensions())
</script>

<svelte:window
    on:mousemove={handleMove}
    on:scroll|capture={recalculateDimensions}
/>

{#if debug && $store.ready}
    <button on:click={recalculateDimensions} class="debug-recalc"
        >Recalculate scroll pos</button
    >
    <pre
        style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
dropIndex: {$dropIndex}
visiblerange: {$store.visibleIdRange.join(' -> ')}
    </pre>
{/if}

<div
    bind:this={ref}
    class="inner-wrapper {className}"
    style="width: {maxDimension[0]}px; height: {maxDimension[1]}px;"
>
    {#each data as item, index (item.id)}
        {#if shouldRender(index, $store)}
            <DragItem {index}>
                <slot
                    name="item"
                    {item}
                    {index}
                    isDragging={$store.dragIds.has(index)}
                />
            </DragItem>
        {/if}
    {/each}
    <slot name="indicator">
        <DragIndicator />
    </slot>
</div>

<style>
    .inner-wrapper {
        position: relative;
    }

    .debug-recalc {
        position: fixed;
        top: 0;
        right: 0;
    }
</style>
