const plugin = require("../../lib");
describe("@html-eslint/eslint-plugin", () => {
  it("should have meta", () => {
    expect(plugin.meta.name).toBe("@html-eslint/eslint-plugin");
    expect(typeof plugin.meta.version).toBe("string");
  });
});
