import { intersect } from './intersect'

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

  let nextVisibleRect = rect
  if (parentEl === document.body) {
    nextVisibleRect = intersect(rect, new DOMRect(0, 0, window.innerWidth, window.innerHeight))
  } else {
    const position = getComputedStyle(parentEl).getPropertyValue('position')
    if (!['absolute', 'fixed'].includes(position)) {
      const parentRect = parentEl.getBoundingClientRect()
      nextVisibleRect = intersect(rect, parentRect)
    }
  }

  return getVisibleRect(parentEl, nextVisibleRect)
}