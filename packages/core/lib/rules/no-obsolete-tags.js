/**
 * @import {
 *   ElementAdapter,
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

export function noObsoleteTags() {
  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {NoObsoleteTagsResult}
     */
    checkElement(adapter) {
      const tagName = adapter.getElementName();

      if (OBSOLETE_TAGS_SET.has(tagName)) {
        return [
          {
            messageId: NO_OBSOLETE_TAGS_MESSAGE_IDS.unexpected,
            loc: adapter.open.getLocation(),
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
