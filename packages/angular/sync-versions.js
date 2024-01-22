// Synchronize @sl-design-system versions peer dependencies in dist/package.json
// This script is run as part of the release process

import { readFileSync, writeFileSync } from 'fs';

const source = './dist/package.json',
  packageJson = JSON.parse(readFileSync(source, 'utf8')),
  version = JSON.parse(readFileSync('./package.json', 'utf8')).version;

packageJson.version = version;

Object.keys(packageJson.peerDependencies)
  .filter(name => name.startsWith('@sl-design-system/'))
  .map(async name => {
    const componentName = name.split('@sl-design-system/')[1],
      path = `../components/${componentName}/package.json`;

    const { version } = JSON.parse(readFileSync(path, 'utf8'));

    packageJson.peerDependencies[name] = version;
  });

writeFileSync(source, JSON.stringify(packageJson, null, 2));
