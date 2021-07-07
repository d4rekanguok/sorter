import { writable } from 'svelte/store'

export const key = Symbol('Sorter')

/** @type {Record<Drag.StateNames, Drag.StateNames>} */
export const DragStates = {
    idle: 'idle',
    dragging: 'dragging',
}

export const createStore = () => {
    /** @type {Drag.Store} */
    const initialStore = {
        wd: null,
        itemDimension: [0, 0],
        ready: false,
        state: DragStates.idle,
        dragIds: new Set(),
        selectedIds: new Set(),
        pos: [0, 0],
        offsetPos: [0, 0],
    }

    const { subscribe, update, set } = writable(initialStore)

    /**
     * Transition into a new state
     * @param {Drag.StateNames} state
     */
    const transit = (state, args) =>
        update((store) => {
            if (
                state === store.state ||
                !Object.values(DragStates).includes(state)
            ) {
                return store
            }

            if (state === DragStates.dragging) {
                const { dragId, offsetPos } = args
                const { dragIds, selectedIds } = store
                if (selectedIds.has(dragId)) {
                    selectedIds.forEach((v) => {
                        dragIds.add(v)
                    })
                } else {
                    dragIds.add(dragId)
                }

                store.offsetPos = offsetPos
                store.state = DragStates.dragging
            }
            if (state === DragStates.idle) {
                store.dragIds.clear()
                store.pos = [0, 0]
                store.offsetPos = [0, 0]
                store.state = DragStates.idle
            }

            return store
        })

    /**
     * Utils. Return a promise that resolve after cursor has moved a certain distance
     * @param {number} limit - drag distance (px)
     * @returns {Promise<number>}
     */
    const dragUntil = (limit = 10) => {
        let abort = false
        let unsub
        const promise = new Promise((res, rej) => {
            let currentPos
            unsub = subscribe(({ pos }) => {
                if (!currentPos) {
                    currentPos = [...pos]
                    return
                }

                if (abort) {
                    rej()
                }

                const [cx, cy] = pos
                const [mx, my] = currentPos
                const distance = Math.sqrt(
                    Math.pow(cx - mx, 2) + Math.pow(cy - my, 2)
                )
                if (distance >= limit) {
                    res(distance)
                }
            })
        }).finally(() => {
            unsub()
        })

        return {
            promise,
            abort: () => {
                abort = true
            },
        }
    }

    return { subscribe, update, transit, dragUntil, set }
}