/**
 * @import {Language} from './types';
 */

import {
  languageHTML 
} from './html';
import {
  languageJavaScript 
} from './javascript';
import {
  languageJSX 
} from './jsx';

/**
 * @param {"html" | "javascript" | "jsx"} lang 
 * @returns {Language}
 */
export function createLanguage(lang) {
  switch(lang) {
    case 'html': {
      return languageHTML;
    }
    case 'javascript': {
      return languageJavaScript;
    }
    case 'jsx': {
      return languageJSX
    }
  }
}