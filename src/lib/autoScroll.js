let isMoving = false
let timer
let req
let _axis
let _delta

export const scroll = (el, axis, delta, store) => {
  _delta = delta
  _axis = axis

  if (isMoving) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cancelAnimationFrame(req)
      isMoving = false
    }, 100)
    return
  }

  const move = () => {
    const attr = _axis === 'y' ? 'scrollTop' : 'scrollLeft'
    const offsetAxis = _axis === 'y' ? 1 : 0

    el[attr] += _delta
    store.tempScrollOffset[offsetAxis] += delta
    req = requestAnimationFrame(move)
  }

  isMoving = true
  req = requestAnimationFrame(move)
}