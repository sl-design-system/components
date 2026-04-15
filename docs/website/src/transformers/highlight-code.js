import Prism from 'prismjs';
import PrismLoader from 'prismjs/components/index.js';
import 'prismjs/plugins/custom-class/prism-custom-class.js';

PrismLoader('diff');
PrismLoader.silent = true;
Prism.plugins.customClass.prefix('code-');

export function highlightCode(code, language = 'plain') {
  const alias = language.replace(/^diff-/, ''),
    isDiff = /^diff-/i.test(language);

  if (!Prism.languages[alias]) {
    PrismLoader(alias);
    if (!Prism.languages[alias]) {
      throw new Error(`Unsupported language for code highlighting: "${language}"`);
    }
  }

  if (isDiff) {
    Prism.languages[language] = Prism.languages.diff;
  }

  return Prism.highlight(code, Prism.languages[language], language);
}

export function highlightCodeTransformer(options = {}) {
  options = {
    container: 'body',
    ...options
  };

  return function (doc) {
    const container = doc.querySelector(options.container);
    if (!container) {
      return;
    }

    container.querySelectorAll('code[class*="language-"]').forEach(code => {
      const langClass = [...code.classList.values()].find(val => val.startsWith('language-')),
        lang = langClass ? langClass.replace(/^language-/, '') : 'plain';

      code.innerHTML = highlightCode(code.textContent ?? '', lang);

      const pre = code.closest('pre');
      if (pre) {
        pre.replaceWith(`<doc-code>${pre.outerHTML}</doc-code>`);
      }
    });
  };
}
