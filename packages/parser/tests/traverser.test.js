"use strict";

const createTraverser = require("../lib/traverser");
const createEmitter = require("../lib/emitter");

describe("traverser", () => {
  const childrenKeys = ["childNodes"];
  let traverser = null;
  let emitter = null;

  beforeEach(() => {
    emitter = createEmitter();
    traverser = createTraverser(emitter, childrenKeys);
  });

  test("The traverser should traverse all nodes.", () => {
    const fooFn = jest.fn();
    const tree = {
      name: "root",
      childNodes: [
        {
          name: "child1",
        },
        {
          name: "child2",
        },
      ],
    };

    emitter.on("enter", fooFn);
    traverser.traverse(tree);

    expect(fooFn).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ name: "root" }),
      undefined
    );
    expect(fooFn).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ name: "child1" }),
      expect.objectContaining({ name: "root" })
    );
    expect(fooFn).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ name: "child2" }),
      expect.objectContaining({ name: "root" })
    );
  });
});
