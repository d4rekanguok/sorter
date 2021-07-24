<script>
    import { getContext } from 'svelte'
    import { spring } from 'svelte/motion'
    import { key, DragStates } from './context'

    export let index
    export let draggable = true

    /** @type {number} temporary index while in drag state */
    let nextIndex = index
    let _abortDragPromise = null
    let _dragIdSize = 0
    let isDragging = false
    let posX = 0
    let posY = 0

    const pos = spring(null, {
        stiffness: 0.1,
        damping: 0.4,
    })

    const { store, dragEnd, strategy, debug } = getContext(key)
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

            pos.set(getPos(nextPos, $store.pos, $store.originPos, i))
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
        isDragging = $store.dragIds.has(index)
        posX = isDragging
            ? $pos[0] + ($store.wd?.left - $store.originWd?.left)
            : $pos[0]
        posY = isDragging
            ? $pos[1] + ($store.wd?.top - $store.originWd?.top)
            : $pos[1]
    }

    /**
     * Calculate absolute position based on cursor pos
     * @param {[number, number]} pos
     * @param {[number, number]} offsetPos
     * @param {[number, number]} globalScrollPos scrollX, scrollY
     * @param {number} i
     * @returns {[number, number]}
     */
    const getPos = (nextPos, pos, originPos, i = 0) => {
        const x = nextPos[0] + (pos[0] - originPos[0]) + i * 10
        const y = nextPos[1] + (pos[1] - originPos[1]) + i * 10
        return [x, y]
    }

    const handleMouseDown = async (e) => {
        if (!draggable || e.button === 2) return

        try {
            const { abort, promise } = store.dragUntil(10)
            _abortDragPromise = abort
            document.addEventListener('mouseup', handleMouseUpAbort, true)
            await promise

            const { clientX, clientY } = e
            store.transit(DragStates.dragging, {
                dragId: index,
                originPos: [clientX, clientY],
            })

            document.addEventListener('mouseup', handleMouseUp, true)
        } catch (e) {
            return
        }
    }

    const handleMouseUpAbort = (e) => {
        e.stopPropagation()
        if (_abortDragPromise) _abortDragPromise()
        document.removeEventListener('mouseup', handleMouseUpAbort, true)
    }

    const handleMouseUp = (e) => {
        e.stopPropagation()
        document.removeEventListener('mouseup', handleMouseUp, true)
        dragEnd()
    }
</script>

{#if $store.ready}
    <div
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
        {#if debug}
            <div class="dev">{$pos.join(' | ')}</div>
        {/if}
        <slot isDragging={$store.dragIds.has(index)} />
    </div>
{/if}

<style>
    .drag-item {
        /** do not set top/left to 0 */
        top: auto;
        left: auto;
        contain: layout;
    }

    .dev {
        position: absolute;
        z-index: 100;
        right: 1rem;
        font-size: 0.8rem;
    }
</style>
