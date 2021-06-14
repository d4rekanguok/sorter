import { createStrategy } from '../createStrategy'

/** @type {Drag.Strategy['place']} */
export const place = ({ dragItemIndex, containerDimension, dimension }) => {
    const cw = containerDimension.width
    const [w, h] = dimension

    const rows = Math.floor(cw / w)

    const x = w * (dragItemIndex % rows)
    const y = h * Math.floor(dragItemIndex / rows)
    return [x, y]
}

/** @type {Drag.Strategy['unplace']} */
export const unplace = ({
    position,
    dimension,
    containerDimension,
    scrollPosition,
    length,
}) => {
    const [x, y] = position
    const [w, h] = dimension
    const { width: cw, height: ch } = containerDimension
    const offsetY = scrollPosition[1]

    const rows = Math.floor(cw / w)
    const rowPos = Math.round(x / w)
    const colPos = Math.floor(y / h)
    const i = rowPos + rows * colPos

    const start = Math.ceil(offsetY / h) * rows
    const end = Math.min(length, Math.floor(((offsetY + ch) / h) * rows))

    return Math.max(start, Math.min(end, i))
}

/** @type {Drag.Strategy['getContainerMaxDimension']} */
export const getContainerMaxDimension = (
    length,
    templateDimension,
    containerDimension
) => {
    const [w, h] = templateDimension
    const cw = containerDimension.width
    const rows = Math.floor(cw / w)
    const maxH = h * Math.ceil(length / rows)

    return [cw, maxH]
}

/** @type {Drag.Strategy['autoScroll']} */
export const autoScroll = ({ axis, direction, scrollPos }) => {
    if (axis === 'y' && direction !== 0) {
        scrollPos.start({ direction, axis, delta: 3 })
    } else {
        scrollPos.stop()
    }
}

export default createStrategy({
    place,
    unplace,
    getContainerMaxDimension,
    autoScroll,
})
