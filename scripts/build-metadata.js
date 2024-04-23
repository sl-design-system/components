import { create, ts } from '@custom-elements-manifest/analyzer';
import fg from 'fast-glob';
import fs from 'fs';
import { basename, join, resolve } from 'path';
import { methodAndFieldPlugin, noPrivateFieldsPlugin, sortMembersPlugin } from './cem-plugins.js';
import { eventDecoratorPlugin } from './cem-plugin-event-decorator.js';

const cwd = new URL('.', import.meta.url).pathname;

const buildManifest = async component => {
  const folder = join(cwd, `../packages/components/${component}`),
    entryPoints = await fg(['!**/*.{d,scss,spec,stories}.ts', '**/*.ts'], { cwd: folder });

  const modules = entryPoints.map(entryPoint => {
    const fullPath = resolve(folder, entryPoint),
      source = fs.readFileSync(fullPath).toString();

    return ts.createSourceFile(entryPoint, source, ts.ScriptTarget.ES2015, true);
  });

  const { litPlugin } = await import('@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js');

  const plugins = [
    ...(litPlugin() || []),
    eventDecoratorPlugin(),
    methodAndFieldPlugin('method'),
    methodAndFieldPlugin('field'),
    noPrivateFieldsPlugin(),
    sortMembersPlugin()
  ];

  const customElementManifest = create({ modules, plugins });

  fs.writeFileSync(join(folder, 'custom-elements.json'), `${JSON.stringify(customElementManifest, null, 2)}\n`);
};

const buildAllManifests = async () => {
  const components = await fg('../packages/components/*', { cwd, onlyDirectories: true });

  components.forEach(component => buildManifest(basename(component)));
};

buildAllManifests();
