/**
 * @import {
 *   ElementNodeAdapter,
 *   NoObsoleteTagsResult
 * } from "../types"
 */

// https://html.spec.whatwg.org/#non-conforming-features
const OBSOLETE_TAGS = [
  "applet",
  "acronym",
  "bgsound",
  "dir",
  "frame",
  "frameset",
  "noframes",
  "isindex",
  "keygen",
  "listing",
  "menuitem",
  "nextid",
  "noembed",
  "plaintext",
  "rb",
  "rtc",
  "strike",
  "xmp",
  "basefont",
  "big",
  "blink",
  "center",
  "font",
  "marquee",
  "multicol",
  "nobr",
  "spacer",
  "tt",
];

const OBSOLETE_TAGS_SET = new Set(OBSOLETE_TAGS);

/**
 * @type {{
 *   unexpected: "unexpected";
 * }}
 */
export const NO_OBSOLETE_TAGS_MESSAGE_IDS = {
  unexpected: "unexpected",
};

/**
 * @template ElementNode
 * @template AttributeKeyNode
 * @template AttributeValueNode
 */
export function noObsoleteTags() {
  return {
    /**
     * @param {ElementNodeAdapter<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >} adapter
     * @returns {NoObsoleteTagsResult<ElementNode>}
     */
    checkElement(adapter) {
      const tagName = adapter.getTagName();

      if (OBSOLETE_TAGS_SET.has(tagName)) {
        return [
          {
            messageId: NO_OBSOLETE_TAGS_MESSAGE_IDS.unexpected,
            node: adapter.node(),
            data: {
              tag: tagName,
            },
          },
        ];
      }

      return [];
    },
  };
}
