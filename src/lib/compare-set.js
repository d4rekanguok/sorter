/**
 * 
 * @param {Set<*>} a 
 * @param {Set<*>} b 
 * @returns {boolean}
 */
export const isEqualSet = (a, b) => {
  return a.size === b.size && Array.from(a).every((i) => b.has(i))
}