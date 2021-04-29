import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'

//Rectangle [x     , y     , w     , h     ]
type Rect = [number, number, number, number]
type Point= [number, number]

interface MoveArgs {
  direction: -1 | 1 | 0
  axis: 'x' | 'y'
  delta: number,
  bound: Rect
}

export const isOverlapped = (p: Point , r: Rect) => {
  const [px, py] = p
  const [rx, ry, rw, rh] = r

  return (px >= rx) 
    && (px <= (rx + rw)) 
    && (py >= ry) 
    && (py <= (ry + rh))
}

export const detectScrollZone = (
  clientPos: [number, number], 
  bound: DOMRect, 
  size: number
): Omit<MoveArgs, 'delta' | 'bound'> => {
  let direction: 1 | -1 | 0 = 0
  let axis: 'x' | 'y' = 'y'

  const { x: rx, y: ry, width: rw, height: rh  } = bound
  const topBound: Rect = [rx, ry, rw, size]
  const bottomBound: Rect = [rx, ry + rh - size, rw, size]
  const leftBound: Rect = [rx, ry, size, rh]
  const rightBound: Rect = [rx + rw, ry - size, size, rh]
  
  if (isOverlapped(clientPos, topBound)) {
    direction = -1
    axis = 'y'
  }
  if (isOverlapped(clientPos, bottomBound)) {
    direction = 1
    axis = 'y'
  }
  if (isOverlapped(clientPos, leftBound)) {
    direction = -1
    axis = 'x'
  }
  if (isOverlapped(clientPos, rightBound)) {
    direction = 1
    axis = 'x'
  }

  return { direction, axis }
}

export const createAutoScrollStore = () => {
  let _bound: Rect = [0, 0, 0, 0]
  let timer = null
  const { subscribe, update, set } = writable<[number, number]>([0, 0])

  const start = (args: MoveArgs) => {
    if (timer) return
    loop(args)
  }

  const stop = () => {
    cancelAnimationFrame(timer)
    timer = null
  }

  const loop = (args: MoveArgs) => {
    move(args)

    timer = requestAnimationFrame(() => {
      loop(args)
    })
  }

  const updateBound = (newBound: Rect) => {
    _bound = newBound
  }

  const move = ({ direction, axis, delta }: MoveArgs) => {
    let id = axis === 'x' ? 0 : 1
    let change = delta * direction


    return update(scrollPos => {
      const nextScrollPos = (scrollPos.slice()) as Point
      nextScrollPos[id] += change

      if (isOverlapped(nextScrollPos, _bound)) {
        return nextScrollPos
      } else {
        return scrollPos
      }
    })
  }

  return {
    subscribe,
    updateBound,
    start,
    stop,
    set,
  }
}