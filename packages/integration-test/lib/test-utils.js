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
/**
 * @param {string} name
 * @returns {string}
 */
function packageFileVersion(name) {
  return `file:${path.join(__dirname, "../../", name)}`;
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
  const devDependencies = {};
  localPackages.forEach((pkg) => {
    devDependencies[pkg] = packageFileVersion(pkg.replace("@html-eslint/", ""));
  });

  const packageJson = {
    name: fixtureName,
    private: true,
    version: "0.0.2",
    packageManager: "yarn@4.9.1",
    scripts,
    devDependencies: {
      eslint: eslintVersion,
      typescript: ts ? "5.9.3" : undefined,
      ...devDependencies,
    },
    resolutions: {
      "@html-eslint/template-parser": packageFileVersion("template-parser"),
      "@html-eslint/template-syntax-parser": packageFileVersion(
        "template-syntax-parser"
      ),
      "@html-eslint/core": packageFileVersion("core"),
      "@html-eslint/parser": packageFileVersion("parser"),
    },
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
 * @param {string[]} localPackages
 * @param {boolean} log
 */
async function runESLint({
  fixtureName,
  eslintVersion,
  glob,
  localPackages,
  log,
}) {
  const { dir } = await setup({ fixtureName, eslintVersion, localPackages });

  await execFile("yarn", ["install", "--no-immutable"], {
    cwd: dir,
  }).catch((e) => {
    log && console.error(e);
  });
  const outFile = await tmpFile();
  await execFile(
    "yarn",
    ["eslint", "--format", "json", "--output-file", outFile, glob],
    {
      cwd: dir,
    }
  ).catch((e) => {
    log && console.error(e);
  });

  const result = await readFile(outFile, "utf-8");

  const parsed = JSON.parse(result);
  return parsed;
}

/**
 * @param {Object} params
 * @param {string} params.fixtureName
 * @param {string} params.eslintVersion
 * @param {string} params.fileName
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
      ts: `tsc -p ./tsconfig.json`,
    },
    localPackages,
    log,
  });
  await execFile("yarn", ["install", "--no-immutable"], {
    cwd: dir,
  }).catch((e) => {
    log && console.error(e);
  });
  await execFile("yarn", ["run", "ts"], {
    cwd: dir,
  }).catch((e) => {
    log && console.error(e);
    error = e;
  });
  return error;
}

module.exports = {
  runESLint,
  runTypecheck,
};
