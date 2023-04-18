import { build } from 'esbuild';
import fg from 'fast-glob';

const buildPackages = async () => {
  const paths = [];

  for (const entryPoint of await fg([
    './packages/**/!(*.{d,spec,stories}).ts',
    '!./packages/angular/**/*.ts',
    '!./packages/core/**/*.ts'
  ])) {
    paths.push(entryPoint);
  }

  await build({
    bundle: false,
    entryPoints: paths,
    outdir: '.',
    outbase: '.',
    sourcemap: true
  });
};

buildPackages();
