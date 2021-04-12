export const setDataImage = (e) => {
  const i = new Image();
		i.src =
			'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
		e.dataTransfer.setDragImage(i, 0, 0);
}

export const measureContainer = ($el: HTMLElement) => {
	return $el.getBoundingClientRect();
}

export const getDragOffset = (
	clientPosition: [number, number],
	itemPosition: [number, number]
): [number, number] => {
	const [clientX, clientY] = clientPosition
	const [itemX, itemY] = itemPosition
	const offsetX = clientX - itemX
	const offsetY = clientY - itemY

	return [offsetX, offsetY]
}