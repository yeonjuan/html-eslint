const tmp = require("tmp");
const ncp = require("ncp");
const fs = require("fs");
const { promisify } = require("node:util");
const path = require("path");
const childProcess = require("node:child_process");

const copyDir = promisify(ncp.ncp);
const tmpDir = promisify(tmp.dir);
const tmpFile = promisify(tmp.file);

const execFile = promisify(childProcess.execFile);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
tmp.setGracefulCleanup();

const PACKAGE_VERSION = "0.0.2";
const PACKAGE_MANAGER = "yarn@4.9.1";
const TYPESCRIPT_VERSION = "5.9.3";
const HTML_ESLINT_PACKAGES = [
  "template-parser",
  "template-syntax-parser",
  "core",
  "parser",
];

/**
 * @param {string} name
 * @returns {string}
 */
function packageFileVersion(name) {
  return `file:${path.join(__dirname, "../../", name)}`;
}

/**
 * Install yarn dependencies in a directory
 *
 * @param {string} dir
 * @param {boolean} log
 */
async function installDependencies(dir, log) {
  await execFile("yarn", ["install", "--no-immutable"], { cwd: dir }).catch(
    (e) => {
      if (log) {
        console.error(e);
      }
    }
  );
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string} params.dir
 * @param {string[]} params.localPackages
 * @param {boolean} [params.ts]
 * @param {Record<string, string>} [params.scripts]
 */
async function makePackageJson({
  fixtureName,
  eslintVersion,
  dir,
  ts,
  scripts,
  localPackages,
}) {
  const devDependencies = Object.fromEntries(
    localPackages.map((pkg) => [
      pkg,
      packageFileVersion(pkg.replace("@html-eslint/", "")),
    ])
  );

  const resolutions = Object.fromEntries(
    HTML_ESLINT_PACKAGES.map((pkg) => [
      `@html-eslint/${pkg}`,
      packageFileVersion(pkg),
    ])
  );

  const packageJson = {
    name: fixtureName,
    private: true,
    version: PACKAGE_VERSION,
    packageManager: PACKAGE_MANAGER,
    scripts,
    devDependencies: {
      eslint: eslintVersion,
      typescript: ts ? TYPESCRIPT_VERSION : undefined,
      ...devDependencies,
    },
    resolutions,
  };
  await writeFile(
    path.join(dir, "package.json"),
    JSON.stringify(packageJson),
    "utf-8"
  );
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {Record<string, string>} [params.scripts]
 * @param {string[]} params.localPackages
 * @param {string[]} params.log
 * @returns {Promise<{ dir: string }>}
 */
async function setup({
  fixtureName,
  eslintVersion,
  scripts,
  localPackages,
  log,
}) {
  const dir = await tmpDir();
  const fixturePath = path.join(__dirname, "../fixtures/", fixtureName);

  await copyDir(fixturePath, dir);
  await makePackageJson({
    fixtureName,
    eslintVersion,
    dir,
    scripts,
    localPackages,
    log,
  });
  return { dir };
}

/**
 * @param {Object} params
 * @param {string} params.glob
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string[]} params.localPackages
 * @param {boolean} params.log
 */
async function runESLint({
  fixtureName,
  eslintVersion,
  glob,
  localPackages,
  log,
}) {
  const { dir } = await setup({ fixtureName, eslintVersion, localPackages });

  await installDependencies(dir, log);

  const outFile = await tmpFile();
  await execFile(
    "yarn",
    ["eslint", "--format", "json", "--output-file", outFile, glob],
    { cwd: dir }
  ).catch((e) => {
    if (log) {
      console.error(e);
    }
  });

  const result = await readFile(outFile, "utf-8");
  return JSON.parse(result);
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string[]} params.localPackages
 * @param {boolean} params.log
 */
async function runTypecheck({
  fixtureName,
  eslintVersion,
  localPackages,
  log,
}) {
  let error;
  const { dir } = await setup({
    fixtureName,
    eslintVersion,
    scripts: {
      ts: "tsc -p ./tsconfig.json",
    },
    localPackages,
    log,
  });

  await installDependencies(dir, log);

  await execFile("yarn", ["run", "ts"], { cwd: dir }).catch((e) => {
    if (log) {
      console.error(e);
    }
    error = e;
  });

  return error;
}

module.exports = {
  runESLint,
  runTypecheck,
};
