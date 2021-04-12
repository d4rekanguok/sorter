/**
 * Reorder data *in place*.
 * @param array Array to be reordered
 * @param from array of indexes to be moved
 * @param to target index without offset
 */
export const reorder = <T>(array: T[], from: number[], to: number) => {
  const filteredFrom = from.filter(v => v < array.length && v >= 0)
  // sort id so it's easier to offset index
  const orderedFrom = filteredFrom.slice().sort()
  // map id to item
  const movedItems = orderedFrom.reduce((acc, cur, i) => {
    acc[cur] = array.splice(cur - i, 1)[0]
    return acc
  }, {})
  // put items back to the correct order
  const orderedItems = filteredFrom.map(id => movedItems[id])
  array.splice(to, 0, ...orderedItems);
  return array
}