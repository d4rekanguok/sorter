import { writable } from "svelte/store";

export const key = Symbol('Sorter');

/**
 * @typedef DragStore
 * @type {object}
 * @property {DOMRect} wd - wrapperDimension
 * @property {[number, number]} itemDimension - width & height element dimension
 * @property {boolean} ready
 * @property {boolean} isDragging
 * @property {string[]} dragIds - indexes of elements being dragged
 * @property {[number, number]} pos - cursor position relative to scroll pos / dom
 * @property {null | number} dropIndex - calculated drop index during drag. Null when nothing is being dragged.
 */

export const createStore = () => {
  /** @type {DragStore} */
  const initialStore = {
    wd: null,
    itemDimension: [0, 0],
    ready: false,
    isDragging: false,
    dragIds: [],
    pos: [0, 0],
    dropIndex: null,
  }

  const { subscribe, update } = writable(initialStore);
  
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