<script>
    import { setContext, onMount, createEventDispatcher } from 'svelte'
    import { derived } from 'svelte/store'
    import { key, createStore, DragStates } from './context'
    import { visualize } from './dom-visualize'
    import { getVisibleRect } from './getVisibleRect'
    import { defaultStrategies } from './strategies'

    const dispatch = createEventDispatcher()

    /** @type {Drag.Dimension} [width, height] */
    export let itemDimension = [0, 0]
    export let debug = false
    export let size = 0
    let className = ''
    export { className as class }
    export let strategy = 'vertical'

    const _strategy =
        typeof strategy === 'string' ? defaultStrategies[strategy] : strategy

    const { unplace, getContainerMaxDimension, checkVisibility } = _strategy

    /** @type {HTMLDivElement} */
    export let ref

    const store = createStore()
    const dropIndex = derived(store, (_store) => {
        return _store.dragIds.size > 0
            ? unplace({
                  position: _store.pos,
                  dimension: _store.itemDimension,
                  containerDimension: _store.wd,
                  length: size,
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
            size,
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

    onMount(() => {
        const rect = ref.getBoundingClientRect()
        $store.wd = rect
        $store.originWd = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        }
        $store.itemDimension = itemDimension
        $store.ready = true
    })

    const handleMove = (e) => {
        const { clientX, clientY } = e
        $store.pos = [clientX, clientY]
    }

    const recalculateWrapperDimension = () => {
        const rect = ref.getBoundingClientRect()
        $store.wd = rect
        return rect
    }

    const handleScroll = (e) => {
        const rect = recalculateWrapperDimension()
        if (e.target !== document && e.target.contains(ref)) {
            const visibleRect = getVisibleRect(ref, rect)
            const { wd, itemDimension } = $store
            $store.visibleIdRange = checkVisibility({
                wd,
                itemDimension,
                visibleRect,
            })

            console.log($store.visibleIdRange)
            visualize(visibleRect)
        }
    }

    store.on('dragging', () => recalculateWrapperDimension())
</script>

<svelte:window on:mousemove={handleMove} on:scroll|capture={handleScroll} />

{#if debug && $store.ready}
    <button on:click={recalculateWrapperDimension} class="debug-recalc"
        >Recalculate scroll pos</button
    >
    <pre
        style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
dropIndex: {$dropIndex}
cursor: {$store.pos.join(" | ")}
container dimension: {$store.wd.left} | {$store.wd.top}
container dimension: {$store.originWd.left} | {$store.originWd.top}
container dimension: {$store.wd.left - $store.originWd.left} | {$store.wd.top - $store.originWd.top}
    </pre>
{/if}

<div
    bind:this={ref}
    class="inner-wrapper {className}"
    style="width: {maxDimension[0]}px; height: {maxDimension[1]}px;"
>
    <slot />
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
