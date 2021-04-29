import type { PlaceArgs, UnplaceArgs } from './strategy.type'

export const place = ({
  dragItemIndex,
  containerDimension,
  dimension,
}: PlaceArgs): [number, number] => {
  const cw = containerDimension.width
  const [w, h] = dimension

  const rows = Math.floor(cw / w)

  const x = w * (dragItemIndex % rows)
  const y = h * Math.floor(dragItemIndex / rows) 
  return [x, y]
}

export const setWrapperStyle = () => {
  return 'overflow-y: scroll; overflow-x: hidden';
}

export const setMarkerStyle = () => {
  return `
    top: 0;
    left: -1px;
    width: 2px;
    height: 40px;
    background-color: pink;
  `
}

export const unplace = ({
  position, 
  dimension,
  containerDimension, 
  scrollPosition,
  length
}: UnplaceArgs): number => {
  const [x, y] = position
  const [w, h] = dimension
  const {width:cw, height: ch} = containerDimension
  const offsetY = scrollPosition[1]

  const rows = Math.floor(cw / w)
  const rowPos = Math.round(x / w)
  const colPos = Math.floor(y / h)
  const i = rowPos + (rows * colPos)
  
  const start = Math.ceil(offsetY / h) * rows;
  const end = Math.min(length, Math.floor(
    (offsetY + ch) / h * rows
  ))

  return Math.max(start, Math.min(end, i))
} 

export const getContainerMaxDimension = (
  length: number,
  templateDimension: [number, number],
  containerDimension?: DOMRect
): [number, number] => {
  const [w, h] = templateDimension
  const cw = containerDimension.width
  const rows = Math.floor(cw / w)
  const maxH = h * Math.ceil(length / rows)

  return [cw, maxH];
}

export const autoScroll = ({ axis, direction, scrollPos }) => {
  if (axis === "y" && direction !== 0) {
    scrollPos.start({ direction, axis, delta: 3 });
  } else {
    scrollPos.stop();
  }
}

const strategy = {
  place,
  unplace,
  getContainerMaxDimension,
  setWrapperStyle,
  setMarkerStyle,
  autoScroll,
}

export default strategy