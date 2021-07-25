/**
 * @param {DOMRect} r1 
 * @param {DOMRect} r2 
 * @returns {DOMRect}
 */
 export const intersect = (r1, r2) => {
  const left = Math.max(r1.left, r2.left)
  const top = Math.max(r1.top, r2.top)
  const right = Math.min(r1.right, r2.right)
  const bottom = Math.min(r1.bottom, r2.bottom)
  const width = right - left
  const height = bottom - top

  if (width <= 0 || height <= 0) {
    return new DOMRect(0, 0, 0, 0)
  }

  return new DOMRect(left, top, width, height)
}

/**
 * @param {[number, number]} p 
 * @param {DOMRect} r
 * @returns {boolean}
 */
export const isOverlapped = (p, r) => {
  const [px, py] = p
  const { top: ry, left: rx, width: rw, height: rh } = r
  const left = px >= rx
  const right = px <= rx + rw
  const top = py >= ry
  const bottom = py <= ry + rh
  return top && left && right && bottom
}