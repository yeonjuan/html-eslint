/**
 * @typedef {import("../../types").IASTConverter} IASTConverter
 */

const NodeConverter = require("./node-converter");
const createTraverser = require("../traverser");
const createEmitter = require("../emitter");
const createStack = require("../stack");

class ASTConverter {
  constructor() {
    this.ast = null;
    this.convertedStack = createStack();
    this.emitter = createEmitter();
    this.emitter.on("enter", this.enter.bind(this));
    this.emitter.on("exit", this.exit.bind(this));
    this.traverser = createTraverser(this.emitter, ["childNodes"]);
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

    while (this.convertedStack.top() === null) {
      this.convertedStack.pop();
    }

    const parent = this.convertedStack.top();

    !Array.isArray(parent.childNodes) && (parent.childNodes = []);
    parent.childNodes.push(converted);
  }

  enter(node) {
    const esNode = NodeConverter.toNode(node);
    if (esNode) {
      esNode.childNodes = [];
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
