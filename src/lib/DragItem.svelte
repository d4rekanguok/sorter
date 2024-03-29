<script>
    import { getContext, createEventDispatcher } from 'svelte'
    import { spring } from 'svelte/motion'
    import { key, DragStates } from './context'

    export let index
    export let draggable = true

    const dispatch = createEventDispatcher()

    /** @type {number} temporary index while in drag state */
    let nextIndex = index
    let _abortDragPromise = null
    let _dragIdSize = 0
    let isDragging = false
    let isMainDragger = false
    let posX = 0
    let posY = 0

    /** @type {HTMLElement} */
    let ref

    const pos = spring(null, {
        stiffness: 0.1,
        damping: 0.4,
    })

    const { store, dragEnd, strategy } = getContext(key)
    const { place } = strategy

    $: {
        if ($store.state === DragStates.idle) {
            /* after dragend, reconcile these 2 */
            nextIndex = index
        }

        const nextPos = place({
            index: nextIndex,
            dimension: $store.itemDimension,
        })

        if ($store.dragIds.has(index)) {
            const i = Array.from($store.dragIds)
            .sort((a, b) => a - b)
            .indexOf(index)

            if (isMainDragger) {
                $store.draggingPos = getPos(
                    nextPos,
                    $store.pos,
                    $store.originPos,
                    $store.tempScrollOffset
                )
            }
            if ($store.draggingPos) {
                pos.set($store.draggingPos.map((v) => v + i * 10))
            }
        } else {
            const { dragIds } = $store
            if (dragIds.size !== _dragIdSize) {
                let offset = 0
                dragIds.forEach((idx) => {
                    if (nextIndex > idx) {
                        offset++
                    }
                })
                nextIndex = nextIndex - offset
                _dragIdSize = dragIds.size
            }

            pos.set(nextPos)
        }
    }

    $: {
        const { dragIds, wd, originWd, wrapperScrollPos } = $store
        isDragging = dragIds.has(index)
        let dx = 0
        let dy = 0

        if (wd && originWd) {
            dx = wd.left - originWd.left
            dy = wd.top - originWd.top
        }

        if (wrapperScrollPos) {
            dx -= wrapperScrollPos[0]
            dy -= wrapperScrollPos[1]
        }

        posX = isDragging ? $pos[0] + dx : $pos[0]
        posY = isDragging ? $pos[1] + dy : $pos[1]
    }

    /**
     * Calculate absolute position based on cursor pos
     * @param {[number, number]} pos
     * @param {[number, number]} offsetPos
     * @param {[number, number]} globalScrollPos scrollX, scrollY
     * @param {[number, number]} tempScrollOffset
     * @returns {[number, number]}
     */
    const getPos = (nextPos, pos, originPos, tempScrollOffset) => {
        const x = nextPos[0] + (pos[0] - originPos[0]) + tempScrollOffset[0]
        const y = nextPos[1] + (pos[1] - originPos[1]) + tempScrollOffset[1]
        return [x, y]
    }

    const handleMouseDown = async (e) => {
        if (!draggable || e.button === 2) return
        try {
            const { abort, promise } = store.dragUntil(10)
            _abortDragPromise = abort
            document.addEventListener('mouseup', handleMouseUpAbort, true)

            /* prevent ghost clicks after drag release */
            ref.addEventListener('mouseup', handleElementMouseUp, true)
            ref.addEventListener('click', handleElementMouseUp, true)

            await promise

            dispatch('start')
            const { clientX, clientY } = e
            store.transit(DragStates.dragging, {
                dragId: index,
                originPos: [clientX, clientY],
            })

            isMainDragger = true
            document.removeEventListener('mouseup', handleMouseUpAbort, true)
            document.addEventListener('mouseup', handleMouseUp, true)
        } catch (e) {
            return
        }
    }

    const handleMouseUpAbort = () => {
        if (_abortDragPromise) {
            _abortDragPromise()
            document.removeEventListener('mouseup', handleMouseUpAbort, true)
            ref.removeEventListener('mouseup', handleElementMouseUp, true)
            ref.removeEventListener('click', handleElementMouseUp, true)
        }
    }

    const handleMouseUp = () => {
        document.removeEventListener('mouseup', handleMouseUp, true)
        dragEnd()
        isMainDragger = false
        let el = ref

        /** schedule the removal of the event to the end of the task queue to prevent ghost click on the elemnt */
        setTimeout(() => {
            el.removeEventListener('mouseup', handleElementMouseUp, true)
            el.removeEventListener('click', handleElementMouseUp, true)
        }, 0)
    }

    const handleElementMouseUp = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
</script>

{#if $store.ready}
    <div
        bind:this={ref}
        on:mousedown|preventDefault|stopPropagation|capture={handleMouseDown}
        on:dragstart|preventDefault|stopPropagation={() => null}
        on:drop|preventDefault={() => null}
        on:dragover|preventDefault={() => null}
        class="drag-item"
        style={`
  width: ${$store.itemDimension[0]}px;
  height: ${$store.itemDimension[1]}px;
  position: ${isDragging ? 'fixed' : 'absolute'};
  z-index: ${isDragging ? '10' : '1'};
  transform: translate(${posX}px, ${posY}px);
`}
    >
        <slot />
    </div>
{/if}

<style>
    .drag-item {
        /** do not set top/left to 0 */
        top: auto;
        left: auto;
        contain: layout;
    }
</style>
