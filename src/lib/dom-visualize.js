let el

/**
 * @param {DOMRect} r 
 */
export const visualize = (r) => {
  if (!el) {
    el = document.createElement('div')
  }

  el.style = `
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${r.width}px;
    height: ${r.height}px;
    background-color: tomato;
    opacity: 0.6;
    border: 3px solid red;
    transform: translate(${r.x}px, ${r.y}px);
    pointer-events: none;
  `

  document.body.appendChild(el)
}