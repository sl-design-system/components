import esbuild from 'esbuild';
import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';
import { readFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';
import tinyGlob from 'tiny-glob';

const DEV = process.env.NODE_ENV !== 'PROD';
const jsFolder = 'build';

/**
 * The components import their styles as `import styles from './x.css' with { type: 'css' }`.
 * esbuild has no built-in support for that attribute, so resolve those imports into a custom
 * namespace and hand back a constructable stylesheet. Mirrors
 * `@sl-design-system/rolldown-plugin-css-sheet`, which does the same for rolldown and Vite.
 */
const cssSheetPlugin = {
  name: 'css-sheet',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => {
      if (args.with?.type !== 'css') {
        return null;
      }

      return { path: resolvePath(args.resolveDir, args.path), namespace: 'css-sheet' };
    });

    build.onLoad({ filter: /.*/, namespace: 'css-sheet' }, async args => {
      const css = await readFile(args.path, 'utf8');

      return {
        contents: [
          'const sheet = new CSSStyleSheet();',
          `sheet.replaceSync(${JSON.stringify(css)});`,
          'export default sheet;'
        ].join('\n'),
        loader: 'js'
      };
    });
  }
};

const tsEntrypoints = [
  './src/ts/utils/active-element.ts',
  './src/ts/components/*.ts',
  './src/ts/scripts/*.ts',
  './src/ts/ssr-utils/lit-hydrate-support.ts',
  './src/ts/ssr-utils/is-land.ts'
];
const filesPromises = tsEntrypoints.map(async (entry) => tinyGlob(entry));
const entryPoints = (await Promise.all(filesPromises)).flat();

let config = {
  bundle: true,
  outdir: jsFolder,
  minify: false,
  format: 'esm',
  treeShaking: true,
  plugins: [cssSheetPlugin],
  write: true,
  sourcemap: true,
  splitting: true
};

let componentsBuild = Promise.resolve();

if (DEV) {
  componentsBuild = esbuild
    .build({
      ...config,
      entryPoints,
    })
    .catch(() => process.exit(1));
} else {
  config = {
    bundle: true,
    outdir: jsFolder,
    minify: true,
    format: 'esm',
    treeShaking: true,
    legalComments: 'external',
    plugins: [
      cssSheetPlugin,
      minifyHTMLLiteralsPlugin(),
      gzipPlugin({
        gzip: true,
      }),
    ],
    write: false,
    splitting: true,
  };

  componentsBuild = esbuild
    .build({
      ...config,
      entryPoints,
    })
    .catch(() => process.exit(1));
}

await Promise.all([componentsBuild]);

process.exit(0);
