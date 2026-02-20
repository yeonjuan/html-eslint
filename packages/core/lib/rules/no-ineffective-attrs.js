/**
 * @import {
 *   ElementNodeAdapter,
 *   NoIneffectiveAttrsResult
 * } from "../types"
 */

/**
 * @typedef {{
 *   attr: string;
 *   when: (adapter: ElementNodeAdapter<any, any, any>) => boolean;
 *   message: string;
 * }} AttributeChecker
 */

/**
 * @type {{
 *   ineffective: "ineffective";
 * }}
 */
export const NO_INEFFECTIVE_ATTRS_MESSAGE_IDS = {
  ineffective: "ineffective",
};

/**
 * @template ElementNode
 * @template AttributeKeyNode
 * @template AttributeValueNode
 */
export function noIneffectiveAttrs() {
  /**
   * @param {ElementNodeAdapter<
   *   ElementNode,
   *   AttributeKeyNode,
   *   AttributeValueNode
   * >} adapter
   * @param {string} attrName
   * @returns {string | null}
   */
  function getAttrValue(adapter, attrName) {
    for (const attribute of adapter.getAttributes()) {
      const attrKeyValue = attribute.key.value();
      if (attrKeyValue && attrKeyValue === attrName) {
        const value = attribute.value.value();
        return value || null;
      }
    }
    return null;
  }

  /**
   * @param {ElementNodeAdapter<
   *   ElementNode,
   *   AttributeKeyNode,
   *   AttributeValueNode
   * >} adapter
   * @param {string} attrName
   * @returns {boolean}
   */
  function hasAttr(adapter, attrName) {
    for (const attribute of adapter.getAttributes()) {
      const keyValue = attribute.key.value();
      if (
        keyValue &&
        keyValue.toLocaleLowerCase() === attrName.toLocaleLowerCase()
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {ElementNodeAdapter<
   *   ElementNode,
   *   AttributeKeyNode,
   *   AttributeValueNode
   * >} adapter
   * @param {string} attrName
   * @returns {boolean}
   */
  function isTemplateValueAttr(adapter, attrName) {
    for (const attribute of adapter.getAttributes()) {
      const keyValue = attribute.key.value();
      if (keyValue && keyValue === attrName) {
        const value = attribute.value;
        return value.isExpression();
      }
    }
    return false;
  }

  /** @type {Record<string, AttributeChecker[]>} */
  const checkersByTag = {
    input: [
      {
        attr: "multiple",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return [
            "text",
            "password",
            "radio",
            "checkbox",
            "image",
            "hidden",
            "reset",
            "button",
          ].includes(type);
        },
        message: 'The "multiple" attribute has no effect on this input type.',
      },
      {
        attr: "accept",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return type !== "file";
        },
        message:
          'The "accept" attribute has no effect unless input type is "file".',
      },
      {
        attr: "readonly",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ["checkbox", "radio", "file", "range", "color"].includes(type);
        },
        message: 'The "readonly" attribute has no effect on this input type.',
      },
      {
        attr: "min",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "number",
            "range",
            "date",
            "datetime-local",
            "month",
            "time",
            "week",
          ].includes(type);
        },
        message:
          'The "min" attribute only works with numeric, date, and time input types.',
      },
      {
        attr: "max",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "number",
            "range",
            "date",
            "datetime-local",
            "month",
            "time",
            "week",
          ].includes(type);
        },
        message:
          'The "max" attribute only works with numeric, date, and time input types.',
      },
      {
        attr: "step",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "number",
            "range",
            "date",
            "datetime-local",
            "month",
            "time",
            "week",
          ].includes(type);
        },
        message:
          'The "step" attribute only works with numeric, date, and time input types.',
      },
      {
        attr: "pattern",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
          ].includes(type);
        },
        message:
          'The "pattern" attribute only works with text-based input types.',
      },
      {
        attr: "maxlength",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
          ].includes(type);
        },
        message:
          'The "maxlength" attribute only works with text-based input types.',
      },
      {
        attr: "minlength",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
          ].includes(type);
        },
        message:
          'The "minlength" attribute only works with text-based input types.',
      },
      {
        attr: "placeholder",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
            "number",
          ].includes(type);
        },
        message:
          'The "placeholder" attribute has no effect on this input type.',
      },
      {
        attr: "size",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return ![
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
          ].includes(type);
        },
        message: 'The "size" attribute only works with text-based input types.',
      },
      {
        attr: "list",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "text";
          return [
            "checkbox",
            "radio",
            "file",
            "submit",
            "image",
            "reset",
            "button",
            "hidden",
          ].includes(type);
        },
        message: 'The "list" attribute has no effect on this input type.',
      },
    ],
    script: [
      {
        attr: "defer",
        when: (adapter) => !hasAttr(adapter, "src"),
        message: 'The "defer" attribute has no effect on inline scripts.',
      },
      {
        attr: "async",
        when: (adapter) => !hasAttr(adapter, "src"),
        message: 'The "async" attribute has no effect on inline scripts.',
      },
    ],
    a: [
      {
        attr: "download",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "download" attribute has no effect without an "href".',
      },
      {
        attr: "ping",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "ping" attribute has no effect without an "href".',
      },
      {
        attr: "target",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "target" attribute has no effect without an "href".',
      },
    ],
    audio: [
      {
        attr: "controlslist",
        when: (adapter) => !hasAttr(adapter, "controls"),
        message:
          'The "controlslist" attribute has no effect without "controls".',
      },
    ],
    video: [
      {
        attr: "controlslist",
        when: (adapter) => !hasAttr(adapter, "controls"),
        message:
          'The "controlslist" attribute has no effect without "controls".',
      },
    ],
    form: [
      {
        attr: "enctype",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "method")) {
            return false;
          }
          const method = getAttrValue(adapter, "method") || "get";
          return method ? method.toLowerCase() !== "post" : false;
        },
        message:
          'The "enctype" attribute only has effect when method is "post".',
      },
    ],
    button: [
      {
        attr: "formaction",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "submit";
          return type !== "submit";
        },
        message: 'The "formaction" attribute only works with type="submit".',
      },
      {
        attr: "formmethod",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "submit";
          return type !== "submit";
        },
        message: 'The "formmethod" attribute only works with type="submit".',
      },
      {
        attr: "formenctype",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "submit";
          return type !== "submit";
        },
        message: 'The "formenctype" attribute only works with type="submit".',
      },
      {
        attr: "formnovalidate",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "submit";
          return type !== "submit";
        },
        message:
          'The "formnovalidate" attribute only works with type="submit".',
      },
      {
        attr: "formtarget",
        when: (adapter) => {
          if (isTemplateValueAttr(adapter, "type")) {
            return false;
          }
          const type = getAttrValue(adapter, "type") || "submit";
          return type !== "submit";
        },
        message: 'The "formtarget" attribute only works with type="submit".',
      },
    ],
    area: [
      {
        attr: "download",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "download" attribute has no effect without an "href".',
      },
      {
        attr: "ping",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "ping" attribute has no effect without an "href".',
      },
      {
        attr: "target",
        when: (adapter) => !hasAttr(adapter, "href"),
        message: 'The "target" attribute has no effect without an "href".',
      },
    ],
    img: [
      {
        attr: "usemap",
        when: (adapter) => hasAttr(adapter, "ismap"),
        message: 'The "usemap" and "ismap" attributes cannot be used together.',
      },
    ],
  };

  return {
    /**
     * @param {ElementNodeAdapter<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >} adapter
     * @returns {NoIneffectiveAttrsResult<AttributeKeyNode>}
     */
    checkAttributes(adapter) {
      const elementName = adapter.getTagName();
      const tagCheckers = checkersByTag[elementName];

      if (!tagCheckers) {
        return [];
      }

      /** @type {NoIneffectiveAttrsResult<AttributeKeyNode>} */
      const result = [];
      for (const check of tagCheckers) {
        for (const attribute of adapter.getAttributes()) {
          const attrKeyValue = attribute.key.value();
          const attrValueValue = attribute.value.value();
          if (
            attribute.value.isExpression() ||
            attrValueValue === null ||
            attrKeyValue !== check.attr
          ) {
            continue;
          }

          if (check.when(adapter)) {
            result.push({
              node: attribute.key.node(),
              messageId: NO_INEFFECTIVE_ATTRS_MESSAGE_IDS.ineffective,
              data: {
                message: check.message,
              },
            });
          }
        }
      }

      return result;
    },
  };
}
