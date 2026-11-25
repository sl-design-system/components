import { build } from 'esbuild';
import fg from 'fast-glob';
import { argv } from 'node:process';

const buildPackages = async path => {
  // The extglob in `path` does not exclude `*.d.ts`, so ignore them explicitly
  const entryPoints = await fg(path, { ignore: ['**/*.d.ts'] });

  await build({
    bundle: false,
    entryPoints,
    outdir: '.',
    outbase: '.',
    sourcemap: true
  });
};

const packageType = argv.at(-1);
if (['components', 'locales', 'themes'].includes(packageType)) {
  await buildPackages(`./packages/${packageType}/**/!(*.{d,spec,stories}).ts`);
} else if (packageType === 'examples') {
  await buildPackages(`./examples/**/!(*.{d,spec,stories}).ts`);
}
