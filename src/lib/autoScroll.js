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
    el[attr] += _delta
    store.tempScrollOffset[1] += delta
    req = requestAnimationFrame(move)
  }

  isMoving = true
  req = requestAnimationFrame(move)
}