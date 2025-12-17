import * as fs from "fs";
import bcd from "@mdn/browser-compat-data/forLegacyNode";
import { getStatus } from "compute-baseline";
import prettier from "prettier";

const BASELINE_HIGH = 10;
const BASELINE_LOW = 5;
const BASELINE_FALSE = 0;
const baselineIds = new Map([
  ["high", BASELINE_HIGH],
  ["low", BASELINE_LOW],
  [false, BASELINE_FALSE],
]);

/**
 * Checks whether the given entry object has a __compat.tags property.
 *
 * @param {Object} entry The object to check
 * @returns {boolean} Returns true if the entry has a __compat object with a
 *   non-falsy 'tags' property, otherwise false.
 */
function hasCompatTags(entry) {
  return (
    typeof entry === "object" &&
    entry &&
    "__compat" in entry &&
    entry.__compat.tags
  );
}

/**
 * Recursively traverses BCD (Browser Compatibility Data) and visits entries
 * that have `__compat.tags` including a `web-features:` tag. For each such
 * entry, calls the `visit` callback with the extracted feature ID and the
 * compatibility key path.
 *
 * @param {Object} bcdData The BCD data object to traverse.
 * @param {string[]} parents An array of parent keys representing the current
 *   path in the object hierarchy.
 * @param {(featureId: string, compatKey: string) => void} visit A callback
 *   function invoked for each matching entry.
 */
function traverseCompat(bcdData, parents, visit) {
  Object.entries(bcdData).forEach(([id, entry]) => {
    if (hasCompatTags(entry)) {
      const webFeature = entry.__compat.tags.find((tag) =>
        tag.startsWith("web-features:")
      );
      if (webFeature) {
        const featureId = webFeature.split(":")[1];
        const compatKeys = [...parents, id];
        visit(featureId, compatKeys.join("."));
        traverseCompat(entry, compatKeys, visit);
      }
    }
  });
}

function getFeatureIdAndCompatKeys() {
  /** @type {[string, string][]} */
  const elements = [];

  /** @type {[string, string][]} */
  const globalAttributes = [];

  traverseCompat(
    bcd.html.elements,
    ["html", "elements"],
    (featureId, compatKey) => elements.push([featureId, compatKey])
  );

  traverseCompat(
    bcd.html.global_attributes,
    ["html", "global_attributes"],
    (featureId, compatKey) => globalAttributes.push([featureId, compatKey])
  );
  return {
    elements,
    globalAttributes,
  };
}

/**
 * Encodes baseline status
 *
 * @param {string} status Baseline status
 * @param {number} year Year
 * @returns {string} Encoded status
 */
function encodeBaselineStatus(status, year) {
  return `${status}:${year || ""}`;
}

/**
 * @param {ReturnType<typeof getStatus>} status
 * @returns {Object}
 */
function mapFeatureStatus(status) {
  let baselineYear;
  if (status.baseline_low_date && status.baseline_low_date.startsWith("≤")) {
    baselineYear = Number(status.baseline_low_date.slice(1, 5));
  } else {
    baselineYear = status.baseline_low_date
      ? Number(status.baseline_low_date.slice(0, 4))
      : 0;
  }

  return encodeBaselineStatus(baselineIds.get(status.baseline), baselineYear);
}

/**
 * Shorten the given key ("html.element.a" -> "a")
 *
 * @param {string} key
 * @returns {string}
 */
function shortenKey(key) {
  const [, , ...rest] = key.split(".");
  return rest.join(".");
}

async function generateBaseline() {
  const { elements, globalAttributes } = getFeatureIdAndCompatKeys();
  const elementsStatus = {};
  const globalAttributesStatus = {};
  for (const [featureId, compatKey] of elements) {
    const status = getStatus(featureId, compatKey);
    const key = shortenKey(compatKey);

    elementsStatus[key] = mapFeatureStatus(status);
  }

  for (const [featureId, compatKey] of globalAttributes) {
    const status = getStatus(featureId, compatKey);
    const key = shortenKey(compatKey);

    globalAttributesStatus[key] = mapFeatureStatus(status);
  }

  const js = `
/**
 * This file is auto-generated. (yarn run baseline)
 */
const BASELINE_HIGH = 10;
const BASELINE_LOW = 5;
const BASELINE_FALSE = 0;

const elements = new Map(${JSON.stringify(Object.entries(elementsStatus))});
const globalAttributes = new Map(${JSON.stringify(Object.entries(globalAttributesStatus))});
module.exports = {
  elements,
  globalAttributes,
  BASELINE_HIGH,
  BASELINE_LOW,
  BASELINE_FALSE
}
`;
  const jsPath = "./packages/eslint-plugin/lib/rules/utils/baseline.js";
  const config = await prettier.resolveConfig(jsPath);
  fs.writeFileSync(
    jsPath,
    await prettier.format(js, { filepath: jsPath, ...config })
  );
}

generateBaseline();
