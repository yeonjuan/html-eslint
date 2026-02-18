const plugin = require("../lib");

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

describe("@html-eslint/eslint-plugin-react", () => {
  it("should have meta", () => {
    assertNonNull(plugin.meta);
    expect(plugin.meta.name).toBe("@html-eslint/eslint-plugin-react");
    expect(typeof plugin.meta.version).toBe("string");
  });

  it("should have rules", () => {
    assertNonNull(plugin.rules);
    expect(typeof plugin.rules).toBe("object");
  });
});
