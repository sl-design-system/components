import { build } from 'esbuild';
import fg from 'fast-glob';
import { argv } from 'node:process';

const buildPackages = async (packageType) => {
  const entryPoints = await fg(`./packages/${packageType}/**/!(*.{d,spec,stories}).ts`);

  await build({
    bundle: false,
    entryPoints,
    outdir: '.',
    outbase: '.',
    sourcemap: true
  });
};

const packageType = argv.at(-1);
if (['checklist', 'components', 'locales', 'themes'].includes(packageType)) {
  await buildPackages(packageType);
}
