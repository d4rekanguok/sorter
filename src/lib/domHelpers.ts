export const setDataImage = (e) => {
  const i = new Image();
		i.src =
			'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
		e.dataTransfer.setDragImage(i, 0, 0);
}