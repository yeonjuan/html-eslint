"use strict";

const createEmitter = require("../lib/emitter");

describe("emitter", () => {
  let emitter = null;

  beforeEach(() => {
    emitter = createEmitter();
  });

  test("The listener should not be called if the event name is different", () => {
    const listener = jest.fn();

    emitter.on("foo", listener);
    emitter.emit("bar");

    expect(listener).not.toHaveBeenCalled();
  });

  test("The emitter should emit.", () => {
    const listener = jest.fn();

    emitter.on("foo", listener);
    emitter.emit("foo");

    expect(listener).toHaveBeenCalled();
  });

  test("The emitter should emit arguments.", () => {
    const listener = jest.fn();

    emitter.on("foo", listener);
    emitter.emit("foo", 1, 2, 3);

    expect(listener).toHaveBeenCalledWith(1, 2, 3);
  });

  test("The emitter should support multiple listeners.", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    emitter.on("foo", listener1);
    emitter.on("foo", listener2);
    emitter.emit("foo", 1, 2, 3);

    expect(listener1).toHaveBeenCalledWith(1, 2, 3);
    expect(listener2).toHaveBeenCalledWith(1, 2, 3);
  });
});
