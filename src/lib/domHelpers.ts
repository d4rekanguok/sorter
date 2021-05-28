export const setDataImage = (e) => {
  const i = new Image();
		i.src =
			'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		e.dataTransfer.setDragImage(i, 0, 0);
}

export const measureContainer = ($el: HTMLElement) => {
	return $el.getBoundingClientRect();
}