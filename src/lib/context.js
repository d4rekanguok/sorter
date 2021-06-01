import { writable } from "svelte/store";

export const key = Symbol('Sorter');

export const createStore = () => {
  const { subscribe, update } = writable({
    /** @type {DOMRect} wrapperDimension */
    wd: null,
  
    /** @type {number[]} */
    itemDimension: [0, 0],
  
    /** @type {boolean} */
    ready: false,
  
    /** @type {boolean} */
    isDragging: false,
  
    /** @type {string[]} indexes of elements being dragged */
    dragIds: [],
  
    /** @type {number[]} cursor position relative to scroll pos / dom */
    pos: [0, 0],
  
    /** @type {null | number} next drop index. Null when nothing is being dragged. */
    dropIndex: null,
  });
  
  const drag = (dragId) => update((store) => {
    store.dragIds = [dragId]
    store.isDragging = true
    return store
  })

  const reset = () => update((store) => {
    store.dragIds = [];
    store.isDragging = false;
    store.pos = [0, 0];
    store.dropIndex = null;
 
    return store;
  });

  return { subscribe, update, reset, drag }
}