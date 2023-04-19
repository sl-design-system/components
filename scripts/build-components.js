import { build } from 'esbuild';
import fg from 'fast-glob';

const buildPackages = async () => {
  const paths = [];

  for (const entryPoint of await fg([
    './packages/components/**/!(*.{d,spec,stories}).ts'
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
