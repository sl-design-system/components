import esbuild from 'esbuild';
import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';
import tinyGlob from 'tiny-glob';

const DEV = process.env.NODE_ENV === 'DEV';
const jsFolder = DEV ? 'lib/site' : 'build/site';

const tsEntrypoints = [
  './src/site/ts/utils/active-element.ts',
  './src/site/ts/components/my-counter.ts',
  './src/site/ts/components/test-component.ts',
  './src/site/ts/components/tabs/index.ts',
  './src/site/ts/components/tabs/register.ts',
  './src/site/ts/scripts/*.ts',
  './src/site/ts/ssr-utils/lit-hydrate-support.ts',
  './src/site/ts/ssr-utils/is-land.ts'
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

// seperate build so that the SSR bundle doesn't affect bundling for the frontend
const ssrBuild = esbuild
  .build({
    ...config,
    format: 'iife',
    splitting: false,
    entryPoints: ['src/site/ts/ssr.ts'],
  })
  .catch(() => process.exit(1));

// this code is inlined into the HTML because it is performance-sensitive
const inlineBuild = esbuild
  .build({
    ...config,
    format: 'iife',
    splitting: false,
    entryPoints: ['src/site/ts/ssr-utils/dsd-polyfill.ts'],
  })
  .catch(() => process.exit(1));

await Promise.all([componentsBuild, ssrBuild, inlineBuild]);

process.exit(0);
