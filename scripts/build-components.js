import { build } from 'esbuild';
import fg from 'fast-glob';

const buildPackages = async () => {
  const entryPoints = await fg('./packages/components/**/!(*.{d,spec,stories}).ts');

  await build({
    bundle: false,
    entryPoints,
    outdir: '.',
    outbase: '.',
    sourcemap: true
  });
};

buildPackages();
