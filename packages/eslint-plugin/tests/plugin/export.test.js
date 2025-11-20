const plugin = require("../../lib");
describe("@html-eslint/eslint-plugin", () => {
  it("should have meta", () => {
    // @ts-ignore
    expect(plugin.meta.name).toBe("@html-eslint/eslint-plugin");
    // @ts-ignore
    expect(typeof plugin.meta.version).toBe("string");
  });
});
