const { runESLint, packPackages } = require("../lib/test-utils");

describe("integration tests", () => {
  let devDependencies = {};
  beforeAll(async () => {
    devDependencies = await packPackages();
  });

  describe("eslint-v8-legacy-config", () => {
    // it("should throw a lint error for invalid.html ", async () => {
    //   const htmlResult = await runESLint({
    //     fixtureName: "eslint-v8-legacy-config",
    //     glob: "invalid.html",
    //     devDependencies,
    //   });
    //   expect(htmlResult[0].fatalErrorCount).toBe(0);
    //   expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);
    // }, 20000);

    it("should throw a lint error for invalid.js ", async () => {
      const jsResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "invalid.js",
        devDependencies,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);
  });

  //   it("should not throw any lint error for valid.html and valid.js", async () => {
  //     const htmlResult = await runESLint({
  //       fixtureName: "eslint-v8-legacy-config",
  //       glob: "valid.html",
  //       devDependencies,
  //     });
  //     expect(htmlResult[0].fatalErrorCount).toBe(0);
  //     expect(htmlResult[0].messages.length).toBe(0);

  //     const jsResult = await runESLint({
  //       fixtureName: "eslint-v8-legacy-config",
  //       glob: "valid.js",
  //       devDependencies,
  //     });
  //     expect(jsResult[0].fatalErrorCount).toBe(0);
  //     expect(jsResult[0].messages.length).toBe(0);
  //   }, 20000);
  // });

  // describe("eslint-v9-flat-config", () => {
  //   it("should throw a lint error for invalid.html and invalid.js", async () => {
  //     const htmlResult = await runESLint({
  //       fixtureName: "eslint-v9-flat-config",
  //       glob: "invalid.html",
  //       devDependencies,
  //     });
  //     expect(htmlResult[0].fatalErrorCount).toBe(0);
  //     expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

  //     const jsResult = await runESLint({
  //       fixtureName: "eslint-v9-flat-config",
  //       glob: "invalid.js",
  //       devDependencies,
  //     });
  //     expect(jsResult[0].fatalErrorCount).toBe(0);
  //     expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);
  //   }, 20000);
  //   it("should not throw any lint error for valid.html and valid.js", async () => {
  //     const htmlResult = await runESLint({
  //       fixtureName: "eslint-v9-flat-config",
  //       glob: "valid.html",
  //       devDependencies,
  //     });
  //     expect(htmlResult[0].fatalErrorCount).toBe(0);
  //     expect(htmlResult[0].messages.length).toBe(0);

  //     const jsResult = await runESLint({
  //       fixtureName: "eslint-v9-flat-config",
  //       glob: "valid.js",
  //       devDependencies,
  //     });
  //     expect(jsResult[0].fatalErrorCount).toBe(0);
  //     expect(jsResult[0].messages.length).toBe(0);
  //   }, 20000);
  // });
});
