/**
 * @typedef {import("../../types").IASTConverter} IASTConverter
 */

const createTraverser = require("../traverser");
const createEmitter = require("../emitter");
const createStack = require("../stack");
const NodeFactory = require("./node-factory");

class ASTConverter {
  constructor() {
    this.ast = null;
    this.convertedStack = createStack();
    this.emitter = createEmitter();
    this.emitter.on("enter", this.enter.bind(this));
    this.emitter.on("exit", this.exit.bind(this));
    this.traverser = createTraverser(this.emitter, ["childNodes"]);
    this.parentStack = createStack();
  }

  convert(ast) {
    this.traverser.traverse(ast);
    return this.ast;
  }

  exit() {
    const converted = this.convertedStack.pop();
    if (!converted) {
      return;
    }

    if (this.convertedStack.isEmpty()) {
      this.ast = converted;
      return;
    }

    let parent = this.parentStack.top();
    if (parent === converted) {
      parent = this.parentStack.pop();
    }
    parent = this.parentStack.top();

    parent.childNodes.push(converted);
  }

  enter(node) {
    const esNode = NodeFactory.create(node);
    if (esNode) {
      this.parentStack.push(esNode);
    }
    this.convertedStack.push(esNode);
  }
}

/**
 * @returns {IASTConverter}
 */
module.exports = function createASTConverter() {
  return new ASTConverter();
};
