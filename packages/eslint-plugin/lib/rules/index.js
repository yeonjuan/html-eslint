const requireLang = require("./require-lang");
const requireImgAlt = require("./require-img-alt");
const requireDoctype = require("./require-doctype");
const requireTitle = require("./require-title");
const noDuplicateId = require("./no-duplicate-id");
const noInlineStyles = require("./no-inline-styles");
const noMultipleH1 = require("./no-multiple-h1");
const noExtraSpacingAttrs = require("./no-extra-spacing-attrs");
const noExtraSpacingText = require("./no-extra-spacing-text");
const attrsNewline = require("./attrs-newline");
const elementNewLine = require("./element-newline");
const noSkipHeadingLevels = require("./no-skip-heading-levels");
const indent = require("./indent");
const requireLiContainer = require("./require-li-container");
const quotes = require("./quotes");
const idNamingConvention = require("./id-naming-convention");
const noObsoleteTags = require("./no-obsolete-tags");
const requireClosingTags = require("./require-closing-tags");
const requireMetaDescription = require("./require-meta-description");
const requireFrameTitle = require("./require-frame-title");
const noNonScalableViewport = require("./no-non-scalable-viewport");
const noPositiveTabindex = require("./no-positive-tabindex");
const requireMetaViewport = require("./require-meta-viewport");
const requireMetaCharset = require("./require-meta-charset");
const noTargetBlank = require("./no-target-blank");
const noDuplicateAttrs = require("./no-duplicate-attrs");
const noAbstractRoles = require("./no-abstract-roles");
const requireButtonType = require("./require-button-type");
const noAriaHiddenBody = require("./no-aria-hidden-body");
const noMultipleEmptyLines = require("./no-multiple-empty-lines");
const noAccesskeyAttrs = require("./no-accesskey-attrs");
const noRestrictedAttrs = require("./no-restricted-attrs");
const noTrailingSpaces = require("./no-trailing-spaces");
const requireAttrs = require("./require-attrs");
const noRestrictedAttrValues = require("./no-restricted-attr-values");
const noScriptStyleType = require("./no-script-style-type");
const lowercase = require("./lowercase");
const requireOpenGraphProtocol = require("./require-open-graph-protocol");
const sortAttrs = require("./sort-attrs");
const preferHttps = require("./prefer-https");
const requireInputLabel = require("./require-input-label");
const requireFormMethod = require("./require-form-method");
const noHeadingInsideButton = require("./no-heading-inside-button");
const noInvalidRole = require("./no-invalid-role");
const noNestedInteractive = require("./no-nested-interactive");
const maxElementDepth = require("./max-element-depth");
const requireExplicitSize = require("./require-explicit-size");
const useBaseLine = require("./use-baseline");
const noDuplicateClass = require("./no-duplicate-class");
// import new rule here ↑
// DO NOT REMOVE THIS COMMENT

module.exports = {
  "require-lang": requireLang,
  "require-img-alt": requireImgAlt,
  "require-doctype": requireDoctype,
  "require-title": requireTitle,
  "no-duplicate-id": noDuplicateId,
  "no-inline-styles": noInlineStyles,
  "no-multiple-h1": noMultipleH1,
  "no-extra-spacing-attrs": noExtraSpacingAttrs,
  "no-extra-spacing-text": noExtraSpacingText,
  "attrs-newline": attrsNewline,
  "element-newline": elementNewLine,
  "no-skip-heading-levels": noSkipHeadingLevels,
  "require-li-container": requireLiContainer,
  indent: indent,
  quotes: quotes,
  "id-naming-convention": idNamingConvention,
  "no-obsolete-tags": noObsoleteTags,
  "require-attrs": requireAttrs,
  "require-closing-tags": requireClosingTags,
  "require-meta-description": requireMetaDescription,
  "require-frame-title": requireFrameTitle,
  "no-non-scalable-viewport": noNonScalableViewport,
  "no-positive-tabindex": noPositiveTabindex,
  "require-meta-viewport": requireMetaViewport,
  "require-meta-charset": requireMetaCharset,
  "no-target-blank": noTargetBlank,
  "no-duplicate-attrs": noDuplicateAttrs,
  "no-abstract-roles": noAbstractRoles,
  "require-button-type": requireButtonType,
  "no-aria-hidden-body": noAriaHiddenBody,
  "no-multiple-empty-lines": noMultipleEmptyLines,
  "no-accesskey-attrs": noAccesskeyAttrs,
  "no-restricted-attrs": noRestrictedAttrs,
  "no-trailing-spaces": noTrailingSpaces,
  "no-restricted-attr-values": noRestrictedAttrValues,
  "no-script-style-type": noScriptStyleType,
  "no-heading-inside-button": noHeadingInsideButton,
  "no-invalid-role": noInvalidRole,
  "no-nested-interactive": noNestedInteractive,
  lowercase: lowercase,
  "require-open-graph-protocol": requireOpenGraphProtocol,
  "require-form-method": requireFormMethod,
  "sort-attrs": sortAttrs,
  "prefer-https": preferHttps,
  "require-input-label": requireInputLabel,
  "max-element-depth": maxElementDepth,
  "require-explicit-size": requireExplicitSize,
  "use-baseline": useBaseLine,
  "no-duplicate-class": noDuplicateClass,
  // export new rule here ↑
  // DO NOT REMOVE THIS COMMENT
};
