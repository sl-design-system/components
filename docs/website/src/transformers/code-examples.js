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
        uuid = crypto.randomUUID(),
        id = `code-example-${uuid.slice(-12)}`,
        demo = pre.textContent,
        showSource = code.classList.contains('show-source');

      const langClass = [...code.classList.values()].find(val => val.startsWith('language-')),
        lang = langClass ? langClass.replace(/^language-/, '') : 'plain';

      code.innerHTML = highlightCode(code.textContent ?? '', lang);

      const codeExample = parse(`
        <doc-code-example${showSource ? ' show-source' : ''}>
          ${demo}
          <pre slot="source">${code.innerHTML}</pre>
        </doc-code-example>
      `);

      pre.replaceWith(codeExample);
    });
  };
}
