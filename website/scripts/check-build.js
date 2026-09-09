import assert from 'node:assert/strict';
import { globSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = globSync('**/*.html', { cwd: root });
assert.ok(pages.includes('index.html'), 'Website build is missing index.html');

// Validate the files we actually deploy, including shared chunks imported by the bundles.
const scripts = new Set([
  resolve(root, 'js/components/main.js'),
  resolve(root, 'js/scripts/main.js')
]);
for (const page of pages) {
  const html = readFileSync(resolve(root, page), 'utf8');
  for (const match of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    const src = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) continue;
    const pathname = decodeURIComponent(src.split(/[?#]/)[0]);
    scripts.add(
      resolve(
        pathname.startsWith('/') ? root : dirname(resolve(root, page)),
        pathname.replace(/^\//, '')
      )
    );
  }
}
for (const script of scripts) {
  assert.ok(statSync(script).size > 0, `Missing or empty website script: ${script}`);
}
await build({
  entryPoints: [...scripts],
  bundle: true,
  write: false,
  outdir: resolve(root, '__validation__'),
  platform: 'browser',
  format: 'esm',
  logLevel: 'silent'
});
console.log(
  `Website build verified: ${pages.length} HTML pages, ${scripts.size} script entry points and their imports.`
);
