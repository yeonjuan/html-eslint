/**
 * @typedef {import("../types").IStack} IStack
 */

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  top() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length <= 0;
  }
}

/**
 * @returns {IStack}
 */
module.exports = function createStack() {
  return new Stack();
};
