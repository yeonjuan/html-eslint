/**
 * @import {Language} from './types';
 */

/**
 * @type {Language}
 */
export const languageJavaScript = {
  key: "javascript",
  mime: 'text/javascript',
  initialCode: `html\`
    <div>
        <span>
    </span>
    </div>
\`

const html = /*html*/\`
<div>
    <span>
       </span>
</div>
\`;`,
  initialConfig: {
    rules: {
      "@html-eslint/indent": "error"
    }
  },
  isEqual(lang) {
    return "javascript" === lang
  }
}