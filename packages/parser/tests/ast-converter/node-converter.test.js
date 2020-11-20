const NodeConverter = require("../../lib/ast-converter/node-converter");
const emptyDocument = require("./fixtures/empty-document.json");
const textNode = require("./fixtures/text.json");

describe("NodeConverter", () => {
  describe("toNode()", () => {
    test("Should convert parse5 node to es format", () => {
      expect(NodeConverter.toNode(emptyDocument)).toMatchSnapshot();
      expect(NodeConverter.toNode(textNode)).toMatchSnapshot();
    });
  });
});
