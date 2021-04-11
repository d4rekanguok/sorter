export const place = (i: number, dimension: [number, number], prev?: any) => {
  const [x, y] = dimension
  const nextY = y * i
  return [0, nextY]
}