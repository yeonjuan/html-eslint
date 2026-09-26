/**
 * @import {
 *   ElementAdapter,
 *   RequireLiContainerResult
 * } from "../types"
 */

const VALID_CONTAINERS = new Set(["ul", "ol", "menu"]);

/**
 * @type {{
 *   invalid: "invalid";
 * }}
 */
export const REQUIRE_LI_CONTAINER_MESSAGE_IDS = {
  invalid: "invalid",
};

export function requireLiContainer() {
  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {RequireLiContainerResult}
     */
    checkElement(adapter) {
      const parent = adapter.getParentContainer();

      if (
        parent &&
        (parent.isCustomElement || VALID_CONTAINERS.has(parent.name))
      ) {
        return [];
      }

      return [
        {
          messageId: REQUIRE_LI_CONTAINER_MESSAGE_IDS.invalid,
          loc: adapter.getLocation(),
        },
      ];
    },
  };
}
