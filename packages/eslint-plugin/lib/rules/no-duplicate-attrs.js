/**
 * @import {
 *   Attribute,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {
 *   RuleModule,
 *   SuggestionReportDescriptor
 * } from "../types"
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  getBranchSegments,
  getControlTokenRanges,
  isControlToken,
  areInMutuallyExclusiveBranches,
} = require("./utils/branch-segments");

const MESSAGE_IDS = {
  DUPLICATE_ATTRS: "duplicateAttrs",
  REMOVE_ATTR: "removeAttr",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow duplicate attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-duplicate-attrs"),
    },

    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ATTRS]:
        "The attribute '{{attrName}}' is duplicated.",
      [MESSAGE_IDS.REMOVE_ATTR]:
        "Remove this duplicate '{{attrName}}' attribute.",
    },
  },

  create(context) {
    const branchSegments = getBranchSegments(context);
    const controlTokenRanges = getControlTokenRanges(context);

    /**
     * @param {Attribute} node
     * @param {string} attrName
     * @returns {SuggestionReportDescriptor[]}
     */
    function getSuggestions(node, attrName) {
      return [
        {
          messageId: MESSAGE_IDS.REMOVE_ATTR,
          fix: (fixer) => fixer.removeRange(node.range),
          data: {
            attrName,
          },
        },
      ];
    }

    /**
     * Determine the attribute's effective (template-stripped) name and a source
     * position safe to use for branch-exclusivity comparison.
     *
     * When a template engine is configured, a template token with no separating
     * whitespace gets glued onto the following node's text by es-html-parser —
     * e.g. `{%if x%}data-id="1"` produces a key whose raw `.value` is `"{%if
     * x%}data-id"`, not `"data-id"`. Using that raw value would mean the same
     * logical attribute name never compares equal across branches, and using
     * the whole Attribute node's `.range` for position would place it _before_
     * the branch segment starts (since the glued token's start becomes the
     * node's start). Both would defeat branch exclusivity detection entirely,
     * independent of whether the source happens to have a space after the token
     * — but real template engines (Twig included) do not require one.
     *
     * `attr.key.parts` splits the key into `Part` entries (real text) and
     * `Template` entries (embedded template tokens). We reconstruct the real
     * name from the `Part` entries and use the first `Part` entry's position
     * for comparisons — a position that always falls inside the branch content,
     * regardless of spacing.
     *
     * This is only safe when every `Template` entry glued into the key is a
     * recognized branch-control token (`{% if %}`, `{% else %}`, `{% endif %}`,
     * etc.) — a structural marker whose presence doesn't change the attribute
     * name itself. If a `Template` entry is a plain value-interpolation token
     * instead (e.g. `data-{{name}}`), the attribute name is genuinely dynamic
     * and can't be safely compared at all, so the whole attribute is skipped,
     * matching the rule's original conservative behavior for such cases.
     *
     * @param {Attribute} attr
     * @returns {{ key: string; displayName: string; pos: number } | null}
     */
    function getComparable(attr) {
      const parts = attr.key.parts || [];

      if (parts.length === 0) {
        // No template involvement in the key at all — the common case.
        return {
          key: attr.key.value.toLowerCase(),
          displayName: attr.key.value,
          pos: attr.range[0],
        };
      }

      const partEntries = parts.filter((p) => p.type === NODE_TYPES.Part);
      const templateEntries = parts.filter((p) => p.type !== NODE_TYPES.Part);

      const allGluedTokensAreControlTokens = templateEntries.every((t) =>
        isControlToken(t.range, controlTokenRanges)
      );
      if (!allGluedTokensAreControlTokens) {
        // At least one embedded template token is a genuine value
        // interpolation (e.g. `data-{{name}}`) rather than a structural
        // if/else/endif marker — the name is dynamic and can't be compared.
        return null;
      }

      if (partEntries.length === 0) {
        // The "attribute" is entirely template syntax with no real name at
        // all (e.g. es-html-parser exposing a bare `{% endif %}` as its own
        // pseudo-attribute). Not a genuine attribute — nothing to compare.
        return null;
      }

      const displayName = partEntries.map((p) => p.value).join("");
      return {
        key: displayName.toLowerCase(),
        displayName,
        pos: partEntries[0].range[0],
      };
    }

    /** @param {Tag | StyleTag | ScriptTag} node */
    function check(node) {
      if (!Array.isArray(node.attributes)) return;

      // Maps a normalized attribute name to the list of { attr, pos } entries
      // for that name that have NOT yet been reported as duplicates.
      //
      // Invariant: every pair of entries in any list is mutually exclusive
      // (they live in different branches of the same template if-block).
      //
      // When a new occurrence arrives we check it against the whole stored
      // list.  If it is exclusive with ALL of them, the invariant still holds
      // and we add it without reporting.  If it is NOT exclusive with at least
      // one of them, it is a genuine runtime duplicate and we report it.
      //
      // This list-based approach correctly handles edge cases such as:
      //
      //   <span {% if c1 %} class="a"{% else %} class="b"{% endif %}
      //         {% if c1 %} class="c"{% endif %}>
      //
      // where class[a] and class[c] (both in the same branch) are real
      // duplicates even though class[a]/class[b] and class[b]/class[c] are
      // individually exclusive.
      /** @type {Map<string, { attr: Attribute; pos: number }[]>} */
      const attrsMap = new Map();

      node.attributes.forEach((attr) => {
        const comparable = getComparable(attr);
        if (!comparable) return;
        const { key, displayName, pos } = comparable;

        if (attrsMap.has(key)) {
          const prevList = /** @type {{ attr: Attribute; pos: number }[]} */ (
            attrsMap.get(key)
          );

          // Build the candidate full list and test pairwise exclusivity,
          // comparing positions rather than whole attribute ranges (see
          // getComparable for why).
          const candidate = [...prevList, { attr, pos }];
          const nodesForCheck = candidate.map((c) => ({
            range: /** @type {[number, number]} */ ([c.pos, c.pos]),
          }));
          if (areInMutuallyExclusiveBranches(nodesForCheck, branchSegments)) {
            // All pairs (including the new attr) are branch-exclusive: no
            // report, and add attr to the list to track further occurrences.
            prevList.push({ attr, pos });
          } else {
            context.report({
              node: attr,
              data: {
                attrName: displayName,
              },
              messageId: MESSAGE_IDS.DUPLICATE_ATTRS,
              suggest: getSuggestions(attr, displayName),
            });
            // Do NOT add to prevList: a confirmed duplicate should not
            // suppress future occurrences via the invariant.
          }
        } else {
          attrsMap.set(key, [{ attr, pos }]);
        }
      });
    }

    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
