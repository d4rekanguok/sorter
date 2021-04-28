import type { PlaceArgs, UnplaceArgs } from './strategy.type'

export const place = ({
  dragItemIndex,
  dimension
}: PlaceArgs): [number, number] => {
  const w = dimension[0]
  const x = w * dragItemIndex
  return [x, 0]
}

export const setWrapperStyle = () => {
  return 'overflow-x: scroll; overflow-y: hidden';
}

export const setMarkerStyle = () => {
  return `
    top: 0;
    left: -1px;
    width: 2px;
    height: 100%;
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
  const x = position[0]
  const w = dimension[0]
  const offsetX = scrollPosition[0]

  const start = Math.ceil(offsetX / w);
  const end = Math.min(length, Math.floor(
    (offsetX + containerDimension.width) / w
  ))

  const i = Math.round(x / w)
  return Math.max(start, Math.min(end, i))
} 

export const getContainerMaxDimension = (
  length: number,
  templateDimension: [number, number]
): [number, number] => {
  const [w, h] = templateDimension
  return [w * length, h];
}

export const autoScroll = ({ axis, direction, scrollPos, bound }) => {
  if (axis === "x" && direction !== 0) {
    scrollPos.start({ direction, axis, delta: 3, bound });
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