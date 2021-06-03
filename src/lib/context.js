import { writable } from "svelte/store";

export const key = Symbol("Sorter");

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
  };

  const { subscribe, update } = writable(initialStore);

  /**
   * Enter drag state
   */
  const enterDrag = ({ dragId }) =>
    update((store) => {
      store.dragIds = [dragId];
      store.isDragging = true;
      return store;
    });

  const reset = () =>
    update((store) => {
      store.dragIds = [];
      store.isDragging = false;
      store.pos = [0, 0];
      store.dropIndex = null;

      return store;
    });

  /**
   * Transition into a new state
   * @param {"dragging" | "idle"} state
   */
  const transition = (state, args) => {
    if (state === "dragging") {
      enterDrag(args);
    }
    if (state === "idle") {
      reset();
    }
  };

  /**
   * Utils. Return a promise that resolve after dragging certain distance
   * @param {number} limit - drag distance (px)
   * @returns {Promise<number>}
   */
  const dragUntil = (limit = 10) =>
    new Promise((res, rej) => {
      let currentPos;
      const unsub = subscribe(({ pos }) => {
        if (!currentPos) {
          currentPos = [...pos];
          return;
        }

        const [cx, cy] = pos;
        const [mx, my] = currentPos;
        const distance = Math.sqrt(Math.pow(cx - mx, 2) + Math.pow(cy - my, 2));
        if (distance >= limit) {
          unsub();
          res(distance);
        }
      });

      setTimeout(() => rej(null), 150);
    });

  return { subscribe, update, transition, dragUntil };
};
