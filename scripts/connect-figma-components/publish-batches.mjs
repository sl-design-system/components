import { spawnSync } from 'node:child_process';
import { globSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const files = globSync(resolve(import.meta.dirname, 'src/**/*.figma.batch.json'))
    .sort()
    .filter(file => JSON.parse(readFileSync(file, 'utf8')).length > 0),
  args = process.argv.slice(2);

if (files.length === 0) {
  console.log('No non-empty batch manifests found.');
  process.exit(0);
}

for (const [index, file] of files.entries()) {
  const name = relative(import.meta.dirname, file);
  console.log(`\nPublishing ${index + 1}/${files.length}: ${name}`);

  const result = spawnSync('npx', ['figma', 'connect', 'publish', '--file', file, ...args], {
    cwd: import.meta.dirname,
    stdio: 'inherit'
  });

  if (result.error) {
    console.error(`Failed to start publishing ${name}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Publishing failed for ${name}. Remaining batches were not published.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nFinished ${files.length} batch file(s).`);
