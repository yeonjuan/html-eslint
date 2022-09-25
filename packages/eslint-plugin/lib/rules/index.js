const requireLang = require("./require-lang");
const requireImgAlt = require("./require-img-alt");
const requireDoctype = require("./require-doctype");
const requireTitle = require("./require-title");
const noDuplicateId = require("./no-duplicate-id");
const noInlineStyles = require("./no-inline-styles");
const noMultipleH1 = require("./no-multiple-h1");
const noExtraSpacingAttrs = require("./no-extra-spacing-attrs");
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

module.exports = {
  "require-lang": requireLang,
  "require-img-alt": requireImgAlt,
  "require-doctype": requireDoctype,
  "require-title": requireTitle,
  "no-duplicate-id": noDuplicateId,
  "no-inline-styles": noInlineStyles,
  "no-multiple-h1": noMultipleH1,
  "no-extra-spacing-attrs": noExtraSpacingAttrs,
  "element-newline": elementNewLine,
  "no-skip-heading-levels": noSkipHeadingLevels,
  "require-li-container": requireLiContainer,
  indent: indent,
  quotes: quotes,
  "id-naming-convention": idNamingConvention,
  "no-obsolete-tags": noObsoleteTags,
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
};
