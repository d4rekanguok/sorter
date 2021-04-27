import { writable } from 'svelte/store'

interface MoveArgs {
  direction: -1 | 1
  axis: 'x' | 'y'
  delta: number
}

export const createAutoScrollStore = () => {
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

  const move = ({ direction, axis, delta }: MoveArgs) => {
    let id = axis === 'x' ? 0 : 1
    let change = delta * direction
  
    return update(scrollPos => {
      scrollPos[id] += change
      return scrollPos
    })
  }

  return {
    subscribe,
    start,
    stop,
    set,
  }
}