/**
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 */

class State {
  constructor() {
    this.value = {
      code: "",
      rules: {},
      language: "html",
    };
  }

  onUpdate(observer) {
    this.observers.add(observer);
  }

  notify() {
    this.observers.forEach((observer) => observer({ ...this.value }));
  }

  /**
   * @param {Object} state
   * @param {string} [state.code]
   * @param {RulesRecord} [state.rules]
   * @param {"html" | "js"} [state.language]
   */
  update(state) {
    this.value = { ...this.value, ...state };
    this.notify();
  }
}

export const state = new State();
