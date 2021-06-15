import { writable } from 'svelte/store'

/**
 * @typedef MoveArgs
 * @type {Object}
 * @property {Drag.Direction} direction
 * @property {Drag.Axis} axis
 * @property {number} delta
 * @property {Drag.Rect} bound
 * @property {number} depth
 */

/**
 * @param {Drag.Point} p Point
 * @param {Drag.Rect} r Rectangle
 * @param {0 | 1 | 2 | 3} s Open side, clockwise from top
 * @returns {boolean}
 */
export const isOverlapped = (p, r, s) => {
    const [px, py] = p
    const [rx, ry, rw, rh] = r
    const left = px >= rx
    const right = px <= rx + rw
    const top = py >= ry
    const bottom = py <= ry + rh
    return [top, right, bottom, left].filter((_, i) => i !== s).every((v) => v)
}

/**
 * @typedef DetectResult
 * @type {Object}
 * @property {Drag.Direction} direction
 * @property {Drag.Axis} axis
 * @property {number} depth: a number between 0 - 1, can be used to calculate acceleration
 */

/**
 * @param {Drag.Point} clientPos
 * @param {DOMRect} bound
 * @param {number} size
 * @returns {DetectResult}
 */
export const detectScrollZone = (clientPos, bound, size = -1) => {
    /** @type {Drag.Direction} */
    let direction = 0
    /** @type {Drag.Axis} */
    let axis = 'y'
    let depth = 0

    const { x: rx, y: ry, width: rw, height: rh } = bound
    const topBound = [rx, ry, rw, size]
    const bottomBound = [rx, ry + rh - size, rw, size]
    const leftBound = [rx, ry, size, rh]
    const rightBound = [rx + rw, ry - size, size, rh]

    if (isOverlapped(clientPos, topBound, 0)) {
        direction = -1
        axis = 'y'
        depth = 1 - (clientPos[1] - topBound[1]) / size
    }
    if (isOverlapped(clientPos, bottomBound, 2)) {
        direction = 1
        axis = 'y'
        depth = (clientPos[1] - bottomBound[1]) / size
    }
    if (isOverlapped(clientPos, leftBound, 3)) {
        direction = -1
        axis = 'x'
        depth = 1 - (clientPos[0] - leftBound[0]) / size
    }
    if (isOverlapped(clientPos, rightBound, 1)) {
        direction = 1
        axis = 'x'
        depth = (clientPos[0] - rightBound[0]) / size
    }

    return { direction, axis, depth }
}

export const createAutoScrollStore = () => {
    let timer = null
    let depth = 0
    let scrollBound = [0, 0, 0, 0]

    /** @type {Point} */
    const initialScrollPos = [0, 0]
    const { subscribe, update, set } = writable(initialScrollPos)

    /**
     * @param {MoveArgs} args
     * @returns
     */
    const start = (args) => {
        // treat depth specially so it gets through
        depth = args.depth
        if (timer) return
        loop(args)
    }

    const stop = () => {
        cancelAnimationFrame(timer)
        timer = null
    }

    /**
     * @param {MoveArgs} args
     * @returns
     */
    const loop = (args) => {
        move(args)

        timer = requestAnimationFrame(() => {
            loop(args)
        })
    }

    /**
     * @param {MoveArgs} args
     * @returns
     */
    const move = ({ direction, axis, delta }) => {
        let id = axis === 'x' ? 0 : 1
        let change = delta * direction * depth

        return update((scrollPos) => {
            const nextScrollPos = scrollPos.slice()
            nextScrollPos[id] += change
            if (isOverlapped(nextScrollPos, scrollBound)) {
                return nextScrollPos
            }
            return scrollPos
        })
    }

    /**
     * @param {Drag.Rect} _scrollBound
     */
    const setScrollBound = (_scrollBound) => {
        scrollBound = _scrollBound
    }

    return {
        subscribe,
        start,
        stop,
        set,
        setScrollBound,
    }
}
