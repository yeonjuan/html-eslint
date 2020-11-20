"use strict";

const createASTConverter = require("../../lib/ast-converter/ast-converter");
const BASE = require("../fixtures/parse5/base.json");

describe("emitter", () => {
  let converter = null;

  beforeEach(() => {
    converter = createASTConverter();
  });

  test("The listener should not be called if the event name is different", () => {
    expect(converter.convert(BASE)).toMatchSnapshot();
  });
});
