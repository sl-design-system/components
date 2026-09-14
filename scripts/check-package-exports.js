import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  globSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const condition = '@sl-design-system/source';
const temporary = realpathSync(mkdtempSync(join(tmpdir(), 'slds-exports-')));
const consumer = join(temporary, 'consumer.mjs');
const imports = [];
let packages = 0;

try {
  for (const relative of globSync(
    ['packages/components/*/package.json', 'packages/locales/package.json'],
    { cwd: root }
  )) {
    const manifestPath = join(root, relative);
    const original = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(original);
    const directory = join(root, relative, '..');
    const [pack] = JSON.parse(
      execFileSync(
        'npm',
        ['pack', directory, '--ignore-scripts', '--json', '--pack-destination', temporary],
        {
          cwd: root,
          encoding: 'utf8'
        }
      )
    );
    const destination = join(temporary, 'node_modules', manifest.name);
    mkdirSync(destination, { recursive: true });
    execFileSync('tar', [
      '-xzf',
      join(temporary, pack.filename),
      '--strip-components=1',
      '-C',
      destination
    ]);
    const packed = JSON.parse(readFileSync(join(destination, 'package.json'), 'utf8'));
    assert.deepEqual(packed.exports, manifest.exports, 'npm must not need to rewrite exports');
    for (const [key, entry] of Object.entries(packed.exports)) {
      const target = typeof entry === 'string' ? entry : entry.default;
      assert.equal(typeof target, 'string', `${manifest.name}${key}: missing default export`);
      assert.ok(
        existsSync(join(destination, target)),
        `${manifest.name}: missing packed ${target}`
      );
      const specifier = manifest.name + (key === '.' ? '' : key.slice(1));
      imports.push([specifier, join(destination, target)]);
      if (typeof entry !== 'string') {
        assert.ok(entry[condition]?.endsWith('.ts'), `${specifier}: missing source condition`);
        assert.ok(target.startsWith('./dist/'), `${specifier}: default must use dist`);
        assert.ok(
          !existsSync(join(destination, entry[condition])),
          `${specifier}: source should not be shipped`
        );
        for (const [customConditions, importer, expected] of [
          [[], consumer, join(destination, target).replace(/\.js$/, '.d.ts')],
          [[condition], join(root, 'consumer.ts'), join(directory, entry[condition])]
        ]) {
          const resolved = ts.resolveModuleName(
            specifier,
            importer,
            {
              moduleResolution: ts.ModuleResolutionKind.Bundler,
              customConditions
            },
            ts.sys
          ).resolvedModule;
          assert.equal(
            resolved?.resolvedFileName,
            expected,
            `${specifier}: TypeScript conditions ${customConditions}`
          );
        }
      }
    }
    assert.equal(
      readFileSync(manifestPath, 'utf8'),
      original,
      'source manifest must remain unchanged'
    );
    packages++;
  }
  // Resolve from outside the monorepo, using only the extracted npm packages.
  writeFileSync(
    consumer,
    `import assert from 'node:assert/strict';\nimport { fileURLToPath } from 'node:url';\nfor (const [specifier, expected] of ${JSON.stringify(imports)}) {\nassert.equal(fileURLToPath(import.meta.resolve(specifier)), expected);\n}\n`
  );
  execFileSync(process.execPath, [consumer], { stdio: 'inherit' });
  console.log(
    `Verified ${packages} npm archives and ${imports.length} exports: Node defaults, TypeScript declarations and local source conditions.`
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
