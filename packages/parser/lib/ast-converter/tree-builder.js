/**
 * @typedef {import("../../types").IASTConverter} IASTConverter
 */

const createTraverser = require("../traverser");
const createEmitter = require("../emitter");
const createStack = require("../stack");
const NodeFactory = require("./node-factory");

class TreeBuilder {
  constructor() {
    this.ast = null;
    this.convertedStack = createStack();
    this.emitter = createEmitter();
    this.emitter.on("enter", this.enter.bind(this));
    this.emitter.on("exit", this.exit.bind(this));
    this.traverser = createTraverser(this.emitter, ["childNodes"]);
  }

  build(ast) {
    this.traverser.traverse(ast);
    return this.ast;
  }

  enter(origin) {
    const node = NodeFactory.create(origin);
    this.convertedStack.push(node);
  }

  exit() {
    const current = this.convertedStack.pop();
    if (this.convertedStack.isEmpty()) {
      this.ast = current;
      return;
    }

    const parent = this.convertedStack.top();
    if (Array.isArray(parent.childNodes)) {
      parent.childNodes.push(current);
    } else {
      parent.childNodes = [current];
    }
  }
}

module.exports = function createTreeBuilder() {
  return new TreeBuilder();
};
