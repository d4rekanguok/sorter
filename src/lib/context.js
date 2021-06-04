import { writable } from "svelte/store";

export const key = Symbol("Sorter");

/**
 * @typedef StateName
 * @type {"dragging" | "idle"}
 */

/**
 * @typedef DragStore
 * @type {object}
 * @property {DOMRect} wd - wrapperDimension
 * @property {[number, number]} itemDimension - width & height element dimension
 * @property {boolean} ready
 * @property {StateName} state
 * @property {Set<string>} dragIds - indexes of elements being dragged
 * @property {Set<string>} selectedIds - indexes of selected elements
 * @property {[number, number]} pos - cursor position relative to scroll pos / dom
 * @property {[number, number]} offsetPos - cursor position relative to item being dragged
 * @property {[number, number]} scrollPos - outer wrapper scroll position
 * @property {null | number} dropIndex - calculated drop index during drag. Null when nothing is being dragged.
 */

/** @type {Record<StateName, StateName>} */
export const StateNames = {
  idle: "idle",
  dragging: "dragging",
};

export const createStore = () => {
  /** @type {DragStore} */
  const initialStore = {
    wd: null,
    itemDimension: [0, 0],
    ready: false,
    state: StateNames.idle,
    dragIds: new Set(),
    selectedIds: new Set(),
    pos: [0, 0],
    offsetPos: [0, 0],
    scrollPos: [0, 0],
    dropIndex: null,
  };

  const { subscribe, update } = writable(initialStore);
  const listeners = [];

  /**
   * Transition into a new state
   * @param {StateName} state
   */
  const transit = (state, args) =>
    update((store) => {
      if (state === store.state || !Object.values(StateNames).includes(state)) {
        return store;
      }

      listeners.forEach((cb) => {
        if (cb.__stateName === state && cb.__hook === "pre") {
          cb(store);
        }
      });

      if (state === StateNames.dragging) {
        const { dragId, offsetPos } = args;
        const { dragIds, selectedIds } = store;
        if (selectedIds.has(dragId)) {
          selectedIds.forEach((v) => {
            dragIds.add(v);
          });
        } else {
          dragIds.add(dragId);
        }

        store.offsetPos = offsetPos;
        store.state = StateNames.dragging;
      }
      if (state === StateNames.idle) {
        store.dragIds.clear();
        store.selectedIds.clear();
        store.pos = [0, 0];
        store.offsetPos = [0, 0];
        store.dropIndex = null;
        store.state = StateNames.idle;
      }

      listeners.forEach((cb) => {
        if (cb.__stateName === state && cb.__hook === "post") {
          cb(store);
        }
      });

      return store;
    });

  /**
   * Add callback before transiting into a new state
   * @param {StateName} state
   * @param {"pre" | "post"} hook
   */
  const onTransit = (state, hook, cb) => {
    if (!Object.values(StateNames).includes(state)) {
      return;
    }
    cb.__stateName = state;
    cb.__hook = hook;
    listeners.push(cb);
  };

  /**
   * Utils. Return a promise that resolve after cursor has moved a certain distance
   * @param {number} limit - drag distance (px)
   * @returns {Promise<number>}
   */
  const dragUntil = (limit = 10) => {
    let abort = false;
    let unsub;
    const promise = new Promise((res, rej) => {
      let currentPos;
      unsub = subscribe(({ pos }) => {
        if (!currentPos) {
          currentPos = [...pos];
          return;
        }

        if (abort) {
          rej();
        }

        const [cx, cy] = pos;
        const [mx, my] = currentPos;
        const distance = Math.sqrt(Math.pow(cx - mx, 2) + Math.pow(cy - my, 2));
        if (distance >= limit) {
          res(distance);
        }
      });
    }).finally(() => {
      unsub();
    });

    return {
      promise,
      abort: () => {
        abort = true;
      },
    };
  };

  const subscribeAll = (...args) => {
    const unsub = subscribe(...args);
    return () => {
      unsub();
      listeners = [];
    };
  };

  return { subscribe: subscribeAll, update, transit, onTransit, dragUntil };
};
