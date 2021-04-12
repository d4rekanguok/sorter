export const place = (i: number, dimension: [number, number], prev?: any): [number, number] => {
  const [w, h] = dimension
  const y = h * i
  return [0, y]
}

export const unplace = (position: [number, number], dimension: [number, number], bound: [number, number]): number => {
  const [x, y] = position
  const [w, h] = dimension
  const [start, end] = bound
  const i = Math.round(y / h)
  return Math.max(start, Math.min(end, i))
}