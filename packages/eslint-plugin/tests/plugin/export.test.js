const plugin = require("../../lib");

/**
 * @template T
 * @param {T | null | undefined} value
 * @returns {asserts value is NonNullable<T>}
 */
function assertNonNull(value) {
  if (value === undefined || value === null) {
    throw new TypeError("Unexpected nullish");
  }
}

describe("@html-eslint/eslint-plugin", () => {
  it("should have meta", () => {
    assertNonNull(plugin.meta);
    expect(plugin.meta.name).toBe("@html-eslint/eslint-plugin");
    expect(typeof plugin.meta.version).toBe("string");
  });
});
