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
        justifyClass = [...code.classList.values()].find(val => val.startsWith('justify-')),
        justify = justifyClass ? justifyClass.replace(/^justify-/, '') : null,
        showSource = code.classList.contains('show-source');

      const langClass = [...code.classList.values()].find(val => val.startsWith('language-')),
        lang = langClass ? langClass.replace(/^language-/, '') : 'plain';

      code.innerHTML = highlightCode(code.textContent ?? '', lang);

      const codeExample = parse(`
        <doc-code-example
          ${inverted ? ' inverted' : ''}
          ${justify ? ` justify="${justify}"` : ''}
          ${orientation ? ` orientation="${orientation}"` : ''}
          ${showSource ? ' show-source' : ''}
        >
          ${demo}
          <pre slot="source">${code.innerHTML}</pre>
        </doc-code-example>
      `);

      pre.replaceWith(codeExample);
    });
  };
}
