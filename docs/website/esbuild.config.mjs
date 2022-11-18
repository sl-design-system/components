import esbuild from 'esbuild';
import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';
import tinyGlob from 'tiny-glob';

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
const jsFolder = DEV ? 'lib' : 'build';

// can use glob syntax. this will create a bundle for those specific files.
// you want to add SSR'd files here so that you can hydrate them later with
// <is-land import="js/components/element-definition.js"></is-land>
const tsEntrypoints = [
  './src/ts/components/my-counter.ts',
  './src/ts/components/tabs-component.ts',
  './src/ts/components/test-component.ts',
  // also include a bundle for each individual page
  // './src/pages/*.ts',
  // SSR stuff
  './src/ssr-utils/lit-hydrate-support.ts',
  './src/ssr-utils/is-land.ts'
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

// development build
if (DEV) {
  componentsBuild = esbuild
    .build({
      ...config,
      entryPoints,
    })
    .catch(() => process.exit(1));

  // production build
} else {
  // config must be same for SSR and client builds to prevent hydration template
  // mismatches because we minify the templates in prod
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
    entryPoints: ['src/ts/ssr.ts'],
  })
  .catch(() => process.exit(1));

// this code is inlined into the HTML because it is performance-sensitive
const inlineBuild = esbuild
  .build({
    ...config,
    format: 'iife',
    splitting: false,
    entryPoints: ['src/ts/ssr-utils/dsd-polyfill.ts'],
  })
  .catch(() => process.exit(1));

await Promise.all([componentsBuild, ssrBuild, inlineBuild]);

process.exit(0);
