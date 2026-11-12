import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
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

const root = fileURLToPath(new URL('../', import.meta.url)),
  temporary = realpathSync(mkdtempSync(join(tmpdir(), 'slds-theme-types-'))),
  consumer = join(temporary, 'consumer.ts'),
  themes = [];

try {
  for (const relative of globSync('packages/themes/*/package.json', { cwd: root })) {
    const directory = join(root, relative, '..'),
      manifest = JSON.parse(readFileSync(join(root, relative), 'utf8'));

    if (!globSync('index.ts', { cwd: directory }).length) {
      continue;
    }

    const [pack] = JSON.parse(
        execFileSync(
          'npm',
          ['pack', directory, '--ignore-scripts', '--json', '--pack-destination', temporary],
          { cwd: root, encoding: 'utf8' }
        )
      ),
      packedFiles = pack.files.map(({ path }) => path);

    assert.ok(packedFiles.includes('index.js'), `${manifest.name}: index.js missing from tarball`);
    assert.ok(
      packedFiles.includes('index.d.ts'),
      `${manifest.name}: index.d.ts missing from tarball`
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

    themes.push([manifest.name, join(destination, 'index.d.ts')]);
  }

  assert.ok(themes.length > 0, 'No theme packages found');

  // Consume the extracted tarballs from outside the monorepo, like an application would.
  writeFileSync(
    consumer,
    themes
      .map(
        ([name], index) => `import { setup as setup${index} } from '${name}';\nsetup${index}();\n`
      )
      .join('')
  );

  const options = {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      strict: true,
      target: ts.ScriptTarget.ES2022,
      types: []
    },
    program = ts.createProgram([consumer], options),
    diagnostics = ts.getPreEmitDiagnostics(program);

  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnostics(diagnostics, {
      getCanonicalFileName: name => name,
      getCurrentDirectory: () => temporary,
      getNewLine: () => '\n'
    })
  );

  const checker = program.getTypeChecker(),
    source = program.getSourceFile(consumer);

  themes.forEach(([name, declaration], index) => {
    const resolved = ts.resolveModuleName(name, consumer, options, ts.sys).resolvedModule;
    assert.equal(
      resolved?.resolvedFileName,
      declaration,
      `${name}: TypeScript must resolve the packed index.d.ts`
    );

    const symbol = checker
        .getSymbolsInScope(source, ts.SymbolFlags.Alias)
        .find(s => s.name === `setup${index}`),
      type = checker.typeToString(checker.getTypeOfSymbol(checker.getAliasedSymbol(symbol)));
    assert.equal(type, '() => void', `${name}: unexpected setup signature`);
  });

  console.log(`Verified declarations in ${themes.length} theme npm archives.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
