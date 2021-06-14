import type { PlaceArgs, UnplaceArgs } from './strategy.type'

export const place = ({
  dragItemIndex,
  dimension
}: PlaceArgs): [number, number] => {
  const h = dimension[1]
  const y = h * dragItemIndex
  return [0, y]
}

export const setWrapperStyle = () => {
  return 'overflow-y: scroll; overflow-x: hidden';
}

export const setMarkerStyle = () => {
  return `
    top: -1px;
    width: 100%;
    height: 2px;
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
  const y = position[1] + scrollPosition[1]
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