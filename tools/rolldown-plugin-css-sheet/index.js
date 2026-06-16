import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const JS_EXTENSIONS = new Set(['.ts', '.mts', '.js', '.mjs']);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeTemplateLiteral(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

export function importCssSheet() {
  // Two-way maps so the same real file always gets the same virtual ID,
  // and files with identical names get a numeric suffix to stay unique.
  const virtualToReal = new Map();
  const realToVirtual = new Map();

  function getVirtualId(resolvedPath, cssSource) {
    if (realToVirtual.has(resolvedPath)) return realToVirtual.get(resolvedPath);

    const filename = cssSource
      .split('/')
      .pop()
      .replace(/\.css$/, '.stylesheet');
    let candidate = `\0virtual:${filename}`;
    let n = 1;
    while (virtualToReal.has(candidate)) candidate = `\0virtual:${filename}-${n++}`;

    virtualToReal.set(candidate, resolvedPath);
    realToVirtual.set(resolvedPath, candidate);
    return candidate;
  }

  return {
    name: '@sl-design-system/rolldown-plugin-css-sheet',
    enforce: 'pre',

    async resolveId(source, importer, opts) {
      if (!source.endsWith('.css') || !importer) return null;

      // Strip query string from importer path (Vite sometimes adds these)
      const importerPath = importer.includes('?') ? importer.split('?')[0] : importer;
      if (!JS_EXTENSIONS.has(extname(importerPath))) return null;

      // Check import attributes directly (rolldown/tsdown)
      let isCssSheet = opts.attributes?.['type'] === 'css';

      // Fallback: read importer file to detect 'with { type: "css" }' (Vite)
      if (!isCssSheet) {
        try {
          const importerContent = await readFile(importerPath, 'utf8');
          const pattern = escapeRegex(source) + `['"] *with *\\{ *type: *['"]css['"]`;
          isCssSheet = new RegExp(pattern).test(importerContent);
        } catch {
          return null;
        }
      }

      if (!isCssSheet) return null;

      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (!resolved) return null;

      return getVirtualId(resolved.id, source);
    },

    async load(id) {
      const realId = virtualToReal.get(id);
      if (realId == null) return null;

      const content = await readFile(realId, 'utf8');
      this.addWatchFile(realId);

      const escaped = escapeTemplateLiteral(content);
      const code = [
        `const styles = \`${escaped}\`;`,
        'const sheet = new CSSStyleSheet();',
        'sheet.replaceSync(styles);',
        'export default sheet;'
      ].join('\n');

      return { code, map: null };
    }
  };
}
