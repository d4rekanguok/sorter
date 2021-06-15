<script>
    import { setContext, onMount, createEventDispatcher } from 'svelte'
    import { derived } from 'svelte/store'
    import { key, createStore, DragStates } from './context'
    import { defaultStrategies } from './strategies'
    import { detectScrollZone, createAutoScrollStore } from './autoScroll'

    const dispatch = createEventDispatcher()

    /** @type {Drag.Dimension} [width, height] */
    export let itemDimension = [0, 0]
    export let debug = false
    export let size = 0
    let className
    export { className as class }
    export let strategy = 'vertical'

    const _strategy =
        typeof strategy === 'string' ? defaultStrategies[strategy] : strategy

    const { unplace, getContainerMaxDimension, autoScroll } = _strategy

    /** @type {HTMLDivElement} */
    let ref

    const store = createStore()
    const scrollPos = createAutoScrollStore()
    const dropIndex = derived([store, scrollPos], ([_store, _scrollPos]) => {
        return _store.dragIds.size > 0
            ? unplace({
                  position: _store.pos,
                  scrollPosition: _scrollPos,
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

    $: maxDimension = getContainerMaxDimension({
        size,
        templateDimension: itemDimension,
    })

    setContext(key, {
        store,
        dragEnd,
        dropIndex,
        scrollPos,
        strategy: _strategy,
    })

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
        store.update((store) => {
            const { wd, dragIds } = store
            const { left: offsetX, top: offsetY } = wd
            const x = clientX - offsetX
            const y = clientY - offsetY

            store.pos = [x, y]

            if (dragIds.size > 0) {
                const { direction, axis, depth } = detectScrollZone(
                    [clientX, clientY],
                    wd,
                    40
                )
                autoScroll({ axis, direction, scrollPos, depth })
            }

            return store
        })
    }

    const handleWindowScroll = () => {
        store.update((store) => {
            store.wd = ref.getBoundingClientRect()
            return store
        })
    }

    const handleWrapperScroll = () => {
        if (!ref) return
        const y = ref.scrollTop
        const x = ref.scrollLeft

        if ($store.dragIds.size == 0) {
            scrollPos.stop()
        }

        scrollPos.set([x, y])
    }

    const handleWrapperAutoScroll = ([x, y]) => {
        if (!ref) return
        ref.scrollTop = y
        ref.scrollLeft = x
    }

    $: handleWrapperAutoScroll($scrollPos)

</script>

<svelte:window on:mousemove={handleMove} on:scroll={handleWindowScroll} />

{#if debug}
    <pre
        style="position: fixed; bottom: 0.5rem; left: 0.5rem;">
dropIndex: {$dropIndex}
cursor: {$store.pos.join(" | ")}
scrollPos: {$scrollPos.join(" | ")}
container dimension: {$store.wd?.left} | {$store.wd?.top}
    </pre>
{/if}

<div
    class="outer-wrapper {className}"
    bind:this={ref}
    on:scroll={handleWrapperScroll}
>
    <div
        class="inner-wrapper"
        style="width: {maxDimension[0]}px; height: {maxDimension[1]}px;"
    >
        <slot />
    </div>
</div>

<style>
    .inner-wrapper {
        position: relative;
    }

    .outer-wrapper {
        position: relative;
        overflow: scroll;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .outer-wrapper::-webkit-scrollbar {
        width: 3px;
        height: 3px;
    }

    .outer-wrapper::-webkit-scrollbar-track {
        background: transparent;
    }

    .outer-wrapper::-webkit-scrollbar-thumb {
        background-color: pink;
        border-radius: 100px;
    }

</style>
