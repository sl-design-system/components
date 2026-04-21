import { parse } from 'node-html-parser';
import { highlightCode } from './highlight-code.js';

export function codeExamplesTransformer(options = {}) {
  options = {
    container: 'body',
    ...options
  };

  return function (doc) {
    const container = doc.querySelector(options.container);
    if (!container) {
      return;
    }

    container.querySelectorAll('code.example').forEach(code => {
      const pre = code.closest('pre'),
        demo = pre.textContent,
        orientation = code.classList.contains('horizontal')
          ? 'horizontal'
          : code.classList.contains('vertical')
            ? 'vertical'
            : null,
        inverted = code.classList.contains('inverted'),
        showSource = code.classList.contains('show-source'),
        stretch = code.classList.contains('stretch');

      const langClass = [...code.classList.values()].find(val => val.startsWith('language-')),
        lang = langClass ? langClass.replace(/^language-/, '') : 'plain';

      code.innerHTML = highlightCode(code.textContent ?? '', lang);

      const codeExample = parse(`
        <doc-code-example
          ${inverted ? ' inverted' : ''}
          ${orientation ? ` orientation="${orientation}"` : ''}
          ${showSource ? ' show-source' : ''}
          ${stretch ? ' justify="stretch"' : ''}
        >
          ${demo}
          <pre slot="source">${code.innerHTML}</pre>
        </doc-code-example>
      `);

      pre.replaceWith(codeExample);
    });
  };
}
