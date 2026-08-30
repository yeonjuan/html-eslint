export default {
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["lib/**/*.js", "!lib/**/*.d.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  testEnvironment: "node",
  transform: {},
};
