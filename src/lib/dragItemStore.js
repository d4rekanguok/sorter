import { writable } from "svelte/store";

/**
 * @typedef StateName
 * @type {"dragging" | "idle"}
 */

/**
 * @typedef ItemStore
 * @type {object}
 * @property {StateName} state
 */

export const createItemStore = () => {
  /** @type {ItemStore} */
  const initStore = {
    name: "idle",
  };

  const { subscribe, update } = writable(initStore);

  return {
    subscribe,
  };
};
