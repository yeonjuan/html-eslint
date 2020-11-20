/**
 * @typedef {import("../types").IEmitter} IEmitter
 */

class Emitter {
  constructor() {
    this.listeners = {};
  }
  /**
   * Add an event listener
   * @param {string} name event name
   * @param {Function} listener listener
   * @returns {void}
   */
  on(name, listener) {
    Array.isArray(this.listeners[name])
      ? this.listeners[name].push(listener)
      : (this.listeners[name] = [listener]);
  }

  /**
   * Emits an event to listeners
   * @param {string} name event name
   * @param {...any} args arguments
   */
  emit(name, ...args) {
    (this.listeners[name] || []).forEach((listener) => {
      listener(...args);
    });
  }
}

/**
 * Create an event emitter
 * @returns {IEmitter}
 */
module.exports = function createEmitter() {
  return new Emitter();
};
