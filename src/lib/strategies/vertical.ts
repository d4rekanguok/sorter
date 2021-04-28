interface PlaceArgs {
  dragItemIndex: number
  dimension: [number, number]
}

export const place = ({
  dragItemIndex,
  dimension
}: PlaceArgs): [number, number] => {
  const [w, h] = dimension
  const y = h * dragItemIndex
  return [0, y]
}

interface UnplaceArgs {
  position: [number, number]
  dimension: [number, number]
  containerDimension: DOMRect,
  scrollPosition: [number, number]
  /* data length */
  length: number
}

export const setWrapperStyle = () => {
  return 'overflow-y: scroll; overflow-x: hidden';
}

export const unplace = ({
  position, 
  dimension,
  containerDimension, 
  scrollPosition,
  length
}: UnplaceArgs): number => {
  const y = position[1]
  const h = dimension[1]
  const offsetY = scrollPosition[1]

  const start = Math.ceil(offsetY / h);
  const end = Math.min(length, Math.floor(
    (offsetY + containerDimension.height) / h
  ))

  const i = Math.round(y / h)
  return Math.max(start, Math.min(end, i))
} 

export const getContainerMaxDimension = (
  length: number,
  templateDimension: [number, number]
): [number, number] => {
  const [w, h] = templateDimension
  return [w, h * length];
}

const vertical = {
  place,
  unplace,
  getContainerMaxDimension,
  setWrapperStyle,
}

export default vertical