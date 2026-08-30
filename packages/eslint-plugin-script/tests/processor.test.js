const { Linter } = require("eslint");
const plugin = require("../lib");

describe("processor", () => {
  let linter;

  beforeEach(() => {
    linter = new Linter();
  });

  describe("preprocess", () => {
    it("extracts JS from a single <script> block", () => {
      // TODO: implement
    });

    it("extracts JS from multiple <script> blocks", () => {
      // TODO: implement
    });

    it("ignores <script> tags with non-JS type attributes", () => {
      // TODO: implement (e.g. type="text/html", type="application/json")
    });

    it("returns empty array when there are no <script> blocks", () => {
      // TODO: implement
    });
  });

  describe("postprocess", () => {
    it("remaps message line numbers back to original HTML positions", () => {
      // TODO: implement
    });

    it("remaps message column numbers on the first line of a script block", () => {
      // TODO: implement
    });

    it("returns a flat array of messages across all script blocks", () => {
      // TODO: implement
    });
  });

  describe("integration", () => {
    it("reports JS rule violations inside a <script> block", () => {
      // TODO: implement end-to-end test using Linter with plugin config
    });

    it("applies autofix inside a <script> block and remaps back to the HTML source", () => {
      // TODO: implement
    });
  });
});
