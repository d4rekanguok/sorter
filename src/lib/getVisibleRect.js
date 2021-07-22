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
 * Get visible rect
 * @param {HTMLElement} el
 * @param {DOMRect} visibleRect
 * @returns {DOMRect}
 */
export const getVisibleRect = (el, visibleRect) => {
  if (el.dataset.rsScrollContainer || el === document.body) {
    return visibleRect
  }

  const rect = visibleRect || el.getBoundingClientRect()
  const parentEl = el.parentElement

  let nextVisibleRect
  if (parentEl === document.body) {
    nextVisibleRect = intersect(rect, new DOMRect(0, 0, window.innerWidth, window.innerHeight))
  } else {
    const parentRect = parentEl.getBoundingClientRect()
    nextVisibleRect = intersect(rect, parentRect)
  }

  return getVisibleRect(parentEl, nextVisibleRect)
}