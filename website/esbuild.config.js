import esbuild from 'esbuild';
import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';
import tinyGlob from 'tiny-glob';

const DEV = process.env.NODE_ENV !== 'PROD';
const jsFolder = 'build';

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
