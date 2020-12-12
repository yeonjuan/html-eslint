/**
 * @typedef {import("../../types").IASTConverter} IASTConverter
 */

const createTraverser = require("../traverser");
const createEmitter = require("../emitter");

class TreeAdjuster {
  constructor() {
    this.ast = null;
    this.emitter = createEmitter();
    this.emitter.on("exit", this.exit.bind(this));
    this.traverser = createTraverser(this.emitter, ["childNodes"]);
    this.outRangeNodes = [];
  }

  adjust(ast) {
    this.traverser.traverse(ast);
  }

  exit(current) {
    if (this.outRangeNodes.length && current.startTag && current.endTag) {
      const includededNodes = this.outRangeNodes.filter(child => (
        child.range[0] >= current.startTag.range[0] && child.range[1] <= current.endTag.range[1]
      ));
      current.childNodes.push(...includededNodes);
      this.outRangeNodes = this.outRangeNodes.filter(node => current.childNodes.includes(node));
    }


    if (Array.isArray(current.childNodes)) {
      let nullIndex;
      while(
          (nullIndex = current.childNodes.findIndex(child => child.type === '#null')) !== -1
      ) {
        const nullChild = current.childNodes[nullIndex];
        current.childNodes.splice(nullIndex, 1, ...(nullChild.childNodes || []));
      }
      if (current.startTag && current.endTag) {
        let outRangeIndex;
        while(
          (outRangeIndex = current.childNodes.findIndex(child => {
            return child.range[1] < current.startTag.range[0] || child.range[0] > current.endTag.range[1];
          })) !== -1
        ) {
          const outRangeChild = current.childNodes[outRangeIndex];
          current.childNodes.splice(outRangeIndex, 1);
          this.outRangeNodes.push(outRangeChild);
        }
      }
    }
  }
}

module.exports = function createTreeAdjuster() {
  return new TreeAdjuster();
};
