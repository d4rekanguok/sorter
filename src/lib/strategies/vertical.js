import { createStrategy } from "../createStrategy";

/** @type {Drag.Strategy['place']} */
export const place = ({ index, dimension }) => {
  const h = dimension[1];
  const y = h * index;
  return [0, y];
};

/** @type {Drag.Strategy['unplace']} */
export const unplace = ({
  position,
  dimension,
  containerDimension,
  scrollPosition,
  length,
}) => {
  const y = position[1] + scrollPosition[1];
  const h = dimension[1];
  const offsetY = scrollPosition[1];

  const start = Math.ceil(offsetY / h);
  const end = Math.min(
    length,
    Math.floor((offsetY + containerDimension.height) / h)
  );

  const i = Math.round(y / h);
  return Math.max(start, Math.min(end, i));
};

/** @type {Drag.Strategy['getContainerMaxDimension']} */
export const getContainerMaxDimension = ({
  size,
  templateDimension,
}) => {
  const [w, h] = templateDimension;
  return [w, h * size];
};

/** @type {Drag.Strategy['autoScroll']} */
export const autoScroll = ({ axis, direction, scrollPos }) => {
  if (axis === "y" && direction !== 0) {
    scrollPos.start({ direction, axis, delta: 3 });
  } else {
    scrollPos.stop();
  }
};

const Vertical = createStrategy({
  place,
  unplace,
  getContainerMaxDimension,
  autoScroll,
});

export default Vertical;
