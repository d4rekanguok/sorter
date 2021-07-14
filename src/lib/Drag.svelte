<script>
    import { setContext, onMount, createEventDispatcher } from 'svelte'
    import { derived } from 'svelte/store'
    import { key, createStore, DragStates } from './context'
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

    const { unplace, getContainerMaxDimension } = _strategy

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
        store.update((store) => {
            if (!ref) return store

            store.wd = ref.getBoundingClientRect()
            store.itemDimension = itemDimension
            store.ready = true

            return store
        })
    })

    const handleMove = (e) => {
        const { clientX, clientY } = e
        // const { left: offsetX, top: offsetY } = $store.wd
        // const x = clientX - offsetX
        // const y = clientY - offsetY
        $store.pos = [clientX, clientY]
    }

    const recalculateWrapperDimension = () => {
        $store.wd = ref.getBoundingClientRect()
    }

    // const handleWrapperScroll = () => {
    //     if (!ref) return
    //     const y = ref.scrollTop
    //     const x = ref.scrollLeft

    //     if ($store.dragIds.size == 0) {
    //         scrollPos.stop()
    //     }

    //     scrollPos.set([x, y])
    // }

    // const handleWrapperAutoScroll = ([x, y]) => {
    //     if (!ref) return
    //     ref.scrollTop = y
    //     ref.scrollLeft = x
    // }

    // $: handleWrapperAutoScroll($scrollPos)

    store.on('dragging', () => recalculateWrapperDimension())
</script>

<svelte:window
    on:mousemove={handleMove}
    on:scroll={recalculateWrapperDimension}
/>

{#if debug && $store.ready}
    <button on:click={recalculateWrapperDimension} class="debug-recalc"
        >Recalculate scroll pos</button
    >
    <pre
        style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
dropIndex: {$dropIndex}
cursor: {$store.pos.join(" | ")}
container dimension: {$store.wd.left} | {$store.wd.top}
    </pre>
{/if}

<div
    bind:this={ref}
    class="inner-wrapper"
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
