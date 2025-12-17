/**
 * @typedef {Object} ObsoleteAttrConfig
 * @property {string[]} elements - List of HTML elements where this attribute is
 *   obsolete. Use "*" for all elements.
 * @property {string} suggestion - Suggestion for what to use instead of this
 *   obsolete attribute.
 */

/** @typedef {Record<string, ObsoleteAttrConfig[]>} ObsoleteAttrs */

// https://html.spec.whatwg.org/dev/obsolete.html#non-conforming-features
/** @type {ObsoleteAttrs} */
module.exports = {
  charset: [
    {
      elements: ["a", "link"],
      suggestion:
        "Use an HTTP `Content-Type` header on the linked resource instead.",
    },
    {
      elements: ["script"],
      suggestion:
        "It is redundant to specify it on the script element since it inherits from the document.",
    },
  ],
  coords: [
    {
      elements: ["a"],
      suggestion: "Use area instead of a for image maps.",
    },
  ],
  shape: [
    {
      elements: ["a"],
      suggestion: "Use area instead of a for image maps.",
    },
  ],
  methods: [
    {
      elements: ["a", "link"],
      suggestion: "Use the HTTP OPTIONS feature instead.",
    },
  ],
  name: [
    {
      elements: ["a", "embed", "img", "option"],
      suggestion: "Use the id attribute instead.",
    },
  ],
  rev: [
    {
      elements: ["a", "link"],
      suggestion:
        'Use the rel attribute instead, with an opposite term. (For example, instead of rev="made", use rel="author".)',
    },
  ],
  urn: [
    {
      elements: ["a", "link"],
      suggestion:
        "Specify the preferred persistent identifier using the href attribute instead.",
    },
  ],
  accept: [
    {
      elements: ["form"],
      suggestion:
        "Use the accept attribute directly on the input elements instead.",
    },
  ],
  hreflang: [
    {
      elements: ["area"],
      suggestion:
        "These attributes do not do anything useful, and for historical reasons there are no corresponding IDL attributes on area elements. Omit them altogether.",
    },
  ],
  type: [
    {
      elements: ["area"],
      suggestion:
        "These attributes do not do anything useful, and for historical reasons there are no corresponding IDL attributes on area elements. Omit them altogether.",
    },
    {
      elements: ["li"],
      suggestion: "Use CSS instead.",
    },
    {
      elements: ["menu"],
      suggestion:
        "To implement a custom context menu, use script to handle the contextmenu event. For toolbar menus, omit the attribute.",
    },
    {
      elements: ["style"],
      suggestion:
        "Omit the attribute for CSS; for data blocks, use script as the container instead of style.",
    },
    {
      elements: ["ul"],
      suggestion: "Use CSS instead.",
    },
  ],
  nohref: [
    {
      elements: ["area"],
      suggestion:
        "Omitting the href attribute is sufficient; the nohref attribute is unnecessary. Omit it altogether.",
    },
  ],
  profile: [
    {
      elements: ["head"],
      suggestion: "Unnecessary. Omit it altogether.",
    },
  ],
  manifest: [
    {
      elements: ["html"],
      suggestion: "Use service workers instead.",
    },
  ],
  version: [
    {
      elements: ["html"],
      suggestion: "Unnecessary. Omit it altogether.",
    },
  ],
  ismap: [
    {
      elements: ["input"],
      suggestion:
        "Unnecessary. Omit it altogether. All input elements with a type attribute in the Image Button state are processed as server-side image maps.",
    },
  ],
  usemap: [
    {
      elements: ["input", "object"],
      suggestion: "Use the img element for image maps.",
    },
  ],
  longdesc: [
    {
      elements: ["iframe", "img"],
      suggestion:
        "Use a regular a element to link to the description, or (in the case of images) use an image map to provide a link from the image to the image's description.",
    },
  ],
  lowsrc: [
    {
      elements: ["img"],
      suggestion:
        "Use a progressive JPEG image (given in the src attribute), instead of using two separate images.",
    },
  ],
  target: [
    {
      elements: ["link"],
      suggestion: "Unnecessary. Omit it altogether.",
    },
  ],
  label: [
    {
      elements: ["menu"],
      suggestion:
        "To implement a custom context menu, use script to handle the contextmenu event.",
    },
  ],
  contextmenu: [
    {
      elements: ["*"],
      suggestion:
        "To implement a custom context menu, use script to handle the contextmenu event.",
    },
  ],
  onshow: [
    {
      elements: ["*"],
      suggestion:
        "To implement a custom context menu, use script to handle the contextmenu event.",
    },
  ],
  scheme: [
    {
      elements: ["meta"],
      suggestion:
        "Use only one scheme per field, or make the scheme declaration part of the value.",
    },
  ],
  archive: [
    {
      elements: ["object"],
      suggestion: "Use the data and type attributes to invoke plugins.",
    },
  ],
  classid: [
    {
      elements: ["object"],
      suggestion: "Use the data and type attributes to invoke plugins.",
    },
  ],
  code: [
    {
      elements: ["object"],
      suggestion: "Use the data and type attributes to invoke plugins.",
    },
  ],
  codebase: [
    {
      elements: ["object"],
      suggestion: "Use the data and type attributes to invoke plugins.",
    },
  ],
  codetype: [
    {
      elements: ["object"],
      suggestion: "Use the data and type attributes to invoke plugins.",
    },
  ],
  declare: [
    {
      elements: ["object"],
      suggestion:
        "Repeat the object element completely each time the resource is to be reused.",
    },
  ],
  standby: [
    {
      elements: ["object"],
      suggestion:
        "Optimize the linked resource so that it loads quickly or, at least, incrementally.",
    },
  ],
  typemustmatch: [
    {
      elements: ["object"],
      suggestion: "Avoid using object elements with untrusted resources.",
    },
  ],
  language: [
    {
      elements: ["script"],
      suggestion:
        "Omit the attribute for JavaScript; for data blocks, use the type attribute instead.",
    },
  ],
  event: [
    {
      elements: ["script"],
      suggestion: "Use DOM events mechanisms to register event listeners.",
    },
  ],
  for: [
    {
      elements: ["script"],
      suggestion: "Use DOM events mechanisms to register event listeners.",
    },
  ],
  datapagesize: [
    {
      elements: ["table"],
      suggestion: "Unnecessary. Omit it altogether.",
    },
  ],
  summary: [
    {
      elements: ["table"],
      suggestion:
        "Use one of the techniques for describing tables given in the table section instead.",
    },
  ],
  abbr: [
    {
      elements: ["td"],
      suggestion:
        "Use text that begins in an unambiguous and terse manner, and include any more elaborate text after that. The title attribute can also be useful in including more detailed text, so that the cell's contents can be made terse. If it's a heading, use th (which has an abbr attribute).",
    },
  ],
  axis: [
    {
      elements: ["td", "th"],
      suggestion: "Use the scope attribute on the relevant th.",
    },
  ],
  scope: [
    {
      elements: ["td"],
      suggestion: "Use th elements for heading cells.",
    },
  ],
  datasrc: [
    {
      elements: [
        "a",
        "button",
        "div",
        "frame",
        "iframe",
        "img",
        "input",
        "label",
        "legend",
        "marquee",
        "object",
        "option",
        "select",
        "span",
        "table",
        "textarea",
      ],
      suggestion:
        "Use script and a mechanism such as XMLHttpRequest to populate the page dynamically.",
    },
  ],
  datafld: [
    {
      elements: [
        "a",
        "button",
        "div",
        "fieldset",
        "frame",
        "iframe",
        "img",
        "input",
        "label",
        "legend",
        "marquee",
        "object",
        "select",
        "span",
        "textarea",
      ],
      suggestion:
        "Use script and a mechanism such as XMLHttpRequest to populate the page dynamically.",
    },
  ],
  dataformatas: [
    {
      elements: [
        "button",
        "div",
        "input",
        "label",
        "legend",
        "marquee",
        "object",
        "option",
        "select",
        "span",
        "table",
      ],
      suggestion:
        "Use script and a mechanism such as XMLHttpRequest to populate the page dynamically.",
    },
  ],
  dropzone: [
    {
      elements: ["*"],
      suggestion:
        "Use script to handle the dragenter and dragover events instead.",
    },
  ],
  alink: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  bgcolor: [
    {
      elements: ["body", "table", "td", "th", "tr"],
      suggestion: "Use CSS instead.",
    },
  ],
  bottommargin: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  leftmargin: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  link: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  marginheight: [
    {
      elements: ["body", "iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  marginwidth: [
    {
      elements: ["body", "iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  rightmargin: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  text: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  topmargin: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  vlink: [
    {
      elements: ["body"],
      suggestion: "Use CSS instead.",
    },
  ],
  clear: [
    {
      elements: ["br"],
      suggestion: "Use CSS instead.",
    },
  ],
  align: [
    {
      elements: [
        "caption",
        "col",
        "div",
        "embed",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "iframe",
        "input",
        "img",
        "legend",
        "object",
        "p",
        "table",
        "tbody",
        "thead",
        "tfoot",
        "td",
        "th",
        "tr",
      ],
      suggestion: "Use CSS instead.",
    },
  ],
  char: [
    {
      elements: ["col", "tbody", "thead", "tfoot", "td", "th", "tr"],
      suggestion: "Use CSS instead.",
    },
  ],
  charoff: [
    {
      elements: ["col", "tbody", "thead", "tfoot", "td", "th", "tr"],
      suggestion: "Use CSS instead.",
    },
  ],
  valign: [
    {
      elements: ["col", "tbody", "thead", "tfoot", "td", "th", "tr"],
      suggestion: "Use CSS instead.",
    },
  ],
  width: [
    {
      elements: ["col", "hr", "pre", "table", "td", "th"],
      suggestion: "Use CSS instead.",
    },
  ],
  compact: [
    {
      elements: ["dl", "menu", "ol", "ul"],
      suggestion: "Use CSS instead.",
    },
  ],
  hspace: [
    {
      elements: ["embed", "iframe", "input", "img", "object"],
      suggestion: "Use CSS instead.",
    },
  ],
  vspace: [
    {
      elements: ["embed", "iframe", "input", "img", "object"],
      suggestion: "Use CSS instead.",
    },
  ],
  color: [
    {
      elements: ["hr"],
      suggestion: "Use CSS instead.",
    },
  ],
  noshade: [
    {
      elements: ["hr"],
      suggestion: "Use CSS instead.",
    },
  ],
  size: [
    {
      elements: ["hr"],
      suggestion: "Use CSS instead.",
    },
  ],
  allowtransparency: [
    {
      elements: ["iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  frameborder: [
    {
      elements: ["iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  framespacing: [
    {
      elements: ["iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  scrolling: [
    {
      elements: ["iframe"],
      suggestion: "Use CSS instead.",
    },
  ],
  border: [
    {
      elements: ["input", "img", "object", "table"],
      suggestion: "Use CSS instead.",
    },
  ],
  frame: [
    {
      elements: ["table"],
      suggestion: "Use CSS instead.",
    },
  ],
  bordercolor: [
    {
      elements: ["table"],
      suggestion: "Use CSS instead.",
    },
  ],
  cellpadding: [
    {
      elements: ["table"],
      suggestion: "Use CSS instead.",
    },
  ],
  cellspacing: [
    {
      elements: ["table"],
      suggestion: "Use CSS instead.",
    },
  ],
  height: [
    {
      elements: ["table", "thead", "tbody", "tfoot", "td", "th", "tr"],
      suggestion: "Use CSS instead.",
    },
  ],
  rules: [
    {
      elements: ["table"],
      suggestion: "Use CSS instead.",
    },
  ],
  nowrap: [
    {
      elements: ["td", "th"],
      suggestion: "Use CSS instead.",
    },
  ],
  background: [
    {
      elements: ["body", "table", "thead", "tbody", "tfoot", "tr", "td", "th"],
      suggestion: "Use CSS instead.",
    },
  ],
};
