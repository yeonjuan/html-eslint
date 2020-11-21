module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "require `lang` attribute at `<html>` tag",
      category: "seo",
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      missingLangAttr: "Missing `lang` attribute at `<html>` tag",
      missingLangValue: "Missing value of `lang` attribute"
    },
  },

  create(context) {
    return {
      html (node) {
        const attrs = node.attrs || [];
        const langAttr = attrs.find(isLangAttribute);

        if (!langAttr) {
          context.report({
            node,
            messageId: "missingLangAttr"
          });
        } else if (langAttr.value.trim().length <= 0) {
          context.report({
            node,
            messageId: "missingLangValue"
          }); 
        }
      }
    };
  },
};

function isLangAttribute (attr) {
  return attr.name === "lang";
}
