import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateMappingNames } from './validate-mapping-names.mjs';

// Pure static analysis of local mapping source files. Never calls the Figma API and
// never needs FIGMA_ACCESS_TOKEN, so this is safe to run against untrusted PR code
// (e.g. from forks) in CI.
const files = globSync(resolve(import.meta.dirname, 'src/**/*.figma.ts')).sort(),
  results = files.map(file => ({ file, warnings: validateMappingNames(file) })),
  withWarnings = results.filter(({ warnings }) => warnings.length > 0);

if (withWarnings.length === 0) {
  console.log('No mapping naming issues found.');
} else {
  for (const { file, warnings } of withWarnings) {
    console.log(`\n${file}`);
    for (const warning of warnings) console.log(`  ${warning}`);
  }
}

console.log(
  `\n${withWarnings.length} file(s) with naming warning(s) out of ${files.length} checked.`
);
