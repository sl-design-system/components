/**
 * The mode decision, tested against the two files the probe of 2026-10-05 recorded.
 *
 * Expected values come from `code-connect-explained.md` — _"Course-files (itslearning): 13
 * components, externals `Cell`, `.Main menu`, `.Navigation item`, `your-files` — zero `sl-*`"_ and
 * _"SANNA: 153 components, 24 distinct `sl-*`"_ — never from reading the classifier back.
 *
 * Usage: node --test "runs/harness/*.test.mjs"
 */
import { strict as assert } from 'node:assert';
import { mkdtempSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  WINDOW,
  classify,
  decide,
  externalsOf,
  firstJsonObject,
  inspectFirstWindow,
  readFirstWindow,
  unescapePayload
} from './mode-decision.mjs';

/** @param {string} name */
const fixture = name => join(dirname(fileURLToPath(import.meta.url)), 'fixtures', name);

/**
 * The shape a live response actually has — a bare array, each entry's `dependencies` carrying `{
 * name, external, assetKey }`. Captured 2026-10-05 from `mONnHPTYNNaBwV3cFUHIYv` and kept verbatim
 * in `fixtures/course-files-components.json`, which the last test reads.
 */
/** @param {object[]} components */
const file = components => components;
/** @param {string} name @param {number} instanceCount @param {...string} dependencies */
const component = (name, instanceCount, ...dependencies) => ({
  name,
  instanceCount,
  dependencies: dependencies.map((dependency, index) => ({
    name: dependency,
    external: true,
    assetKey: `key-${index}`
  })),
  assetKey: `own-${name}`
});

const COURSE_FILES = file([
  component('courses', 7, 'Cell', '.Main menu'),
  component('content', 121, 'Cell'),
  component('assignment', 222, '.Navigation item'),
  component('Navigation', 3, 'your-files')
]);

const SANNA = file([
  component('Login', 4, 'sl-button-pill', 'sl-text-field'),
  component('Chat screen', 11, 'sl-dialog', 'sl-checkbox'),
  component('Step 02 – AI understanding', 2, 'sl-grid-row', 'sl-text-field')
]);

/** @param {unknown} payload @returns {string} */
const write = payload => {
  const path = join(mkdtempSync(join(tmpdir(), 'mode-')), 'components.json');

  writeFileSync(path, JSON.stringify(payload, null, 2));

  return path;
};

describe('externalsOf — the externals are read off the dependency graph', () => {
  it('reads a file whose components depend on the design system', async () => {
    const externals = await externalsOf(write(SANNA));

    assert.deepEqual([...externals.keys()].sort(), [
      'sl-button-pill',
      'sl-checkbox',
      'sl-dialog',
      'sl-grid-row',
      'sl-text-field'
    ]);
    assert.equal(externals.get('sl-text-field'), 2);
  });

  it('reads a file whose components depend on another library', async () => {
    const externals = await externalsOf(write(COURSE_FILES));

    assert.deepEqual([...externals.keys()].sort(), [
      '.Main menu',
      '.Navigation item',
      'Cell',
      'your-files'
    ]);
  });

  it('never loads the file whole — it streams, so a 2.18 MB response costs no memory', async () => {
    // A dependency name split across the 64 KiB boundary the reader uses must still be found.
    const padded = [{ name: 'pad', note: 'x'.repeat(70_000), dependencies: [] }, ...SANNA],
      externals = await externalsOf(write(padded));

    assert.ok(externals.has('sl-button-pill'));
  });

  /**
   * The one case read off the wire rather than constructed. `code-connect-explained.md` recorded
   * this file as _"13 — `courses`, `content`, `assignment`, `Navigation`… depending on `Cell`,
   * `.Main menu`, `.Navigation item`, `your-files` — zero `sl-*`"_, and the live response agrees.
   */
  it('matches the live response the probe recorded, externals and all', async () => {
    const externals = await externalsOf(
      join(import.meta.dirname, 'fixtures', 'course-files-components.json')
    );

    assert.deepEqual([...externals.keys()].sort(), [
      '.Main menu',
      '.Navigation item',
      'Cell',
      'your-files'
    ]);
    assert.equal(externals.get('Cell'), 9, 'nine of the thirteen components depend on Cell');
    assert.equal(classify(externals).mode, 'as-is');
  });

  /**
   * What a response actually looks like when it arrives: wrapped in the MCP content envelope, with
   * the payload as an **escaped string** — `\\"name\\": \\"sl-avatar\\"` and `\\n` for the
   * newlines. The first version of this reader found zero externals in 60 KB of real response
   * because it only understood bare JSON, and `fetchComponentsTo` writes the envelope too.
   */
  it('reads the envelope a live call returns, not just bare JSON', async () => {
    const externals = await externalsOf(
      join(import.meta.dirname, 'fixtures', 'nsp-group-list-components.mcp.json')
    );

    assert.ok(externals.has('sl-avatar'), 'sl-avatar is an external of this file');
    assert.ok(
      [...externals.keys()].filter(name => name.startsWith('sl-')).length > 5,
      'an SLDS-based file depends on many sl-* components'
    );
    assert.equal(classify(externals).mode, 'strict');
  });

  it('does not mistake a published component for an external dependency', async () => {
    const externals = await externalsOf(
      join(import.meta.dirname, 'fixtures', 'course-files-components.json')
    );

    for (const published of ['courses', 'content', 'assignment', 'Navigation', 'shield'])
      assert.ok(!externals.has(published), `${published} is published by the file, not external`);
  });
});

describe('classify — strict or as-is, from the externals alone', () => {
  it('a file depending on sl-* is strict', () => {
    const verdict = classify(
      new Map([
        ['sl-button-pill', 4],
        ['Cell', 1]
      ])
    );

    assert.equal(verdict.mode, 'strict');
    assert.deepEqual(verdict.evidence.slds, ['sl-button-pill']);
    assert.equal(verdict.evidence.sldsCount, 1);
  });

  it('a file depending on another library is as-is, and names it', () => {
    const verdict = classify(
      new Map([
        ['Cell', 7],
        ['.Main menu', 1]
      ])
    );

    assert.equal(verdict.mode, 'as-is');
    assert.deepEqual(verdict.evidence.slds, []);
    assert.deepEqual(verdict.evidence.other.sort(), ['.Main menu', 'Cell']);
  });

  /**
   * The corpus is the reason this is not `as-is`. An empty Code Connect result is five causes
   * wearing one symptom — retrieval failure, rejected nested id, another library, unwritten
   * mapping, stale mapping — and only one of them means "another library". Calling it as-is would
   * turn a failed call into a verdict.
   */
  it('a file with no externals at all is undecided, not as-is', () => {
    const verdict = classify(new Map());

    assert.equal(verdict.mode, 'undecided');
    assert.match(verdict.reason, /no externals/i);
  });
});

describe('decide — cached per file and version', () => {
  it('records the verdict with its evidence, not as a bare label', async () => {
    const cache = mkdtempSync(join(tmpdir(), 'cache-')),
      verdict = await decide({ fileKey: 'FILE1', version: 'v1', from: write(SANNA), cache });

    assert.equal(verdict.mode, 'strict');
    assert.equal(verdict.fileKey, 'FILE1');
    assert.equal(verdict.version, 'v1');
    assert.ok(verdict.evidence.slds.length > 0, 'the externals that decided it are named');
    assert.ok(verdict.evidence.sldsCount > 0, 'and counted');
  });

  it('a second design from the same file and version makes no call', async () => {
    const cache = mkdtempSync(join(tmpdir(), 'cache-')),
      options = { fileKey: 'FILE1', version: 'v1', from: write(SANNA), cache };

    await decide(options);

    let calls = 0;
    const second = await decide({
      ...options,
      from: undefined,
      fetchTo: async () => {
        calls += 1;
        throw new Error('a cached file and version must not be fetched again');
      }
    });

    assert.equal(calls, 0);
    assert.equal(second.cached, true);
    assert.equal(second.mode, 'strict');
  });

  it('a new version of the same file is decided again', async () => {
    const cache = mkdtempSync(join(tmpdir(), 'cache-'));

    await decide({ fileKey: 'FILE1', version: 'v1', from: write(SANNA), cache });

    const next = await decide({
      fileKey: 'FILE1',
      version: 'v2',
      from: write(COURSE_FILES),
      cache
    });

    assert.equal(next.cached, false);
    assert.equal(next.mode, 'as-is');
  });
});

// ------------------------------------------------------------------------------------------
// The boundary, added by T-NOJIRA-harness-quality-04.
//
// The two defects this script shipped behind twenty-three green tests were both shape defects,
// and neither raised: the scan simply found nothing and the verdict said so. These tests are
// about the shapes, and every one of them that matters is a stored byte sequence.

describe('unescapePayload — the escaping that hid 60 KB of real data', () => {
  it('unescapes the quotes the MCP envelope adds', () => {
    assert.equal(unescapePayload(String.raw`{\"name\": \"sl-avatar\"}`), '{"name": "sl-avatar"}');
  });

  it('turns the two-character \\n back into a newline', () => {
    assert.equal(unescapePayload(String.raw`a\nb`), 'a\nb');
    assert.equal(unescapePayload(String.raw`a\tb`), 'a\tb');
    assert.equal(unescapePayload(String.raw`a\rb`), 'a\rb');
  });

  it('leaves text with nothing escaped exactly as it was', () => {
    assert.equal(unescapePayload('{"name": "Cell"}'), '{"name": "Cell"}');
  });

  it('does not run off the end on a trailing backslash', () => {
    assert.equal(unescapePayload('abc\\'), 'abc');
  });
});

describe('firstJsonObject — bounded, and it respects strings', () => {
  it('returns the first balanced object', () => {
    assert.equal(firstJsonObject('[ {"a": 1}, {"b": 2} ]'), '{"a": 1}');
  });

  it('is not ended by a brace inside a string value', () => {
    assert.equal(firstJsonObject('[{"a": "} not the end {"}]'), '{"a": "} not the end {"}');
  });

  it('is not ended by a brace hidden behind an escaped quote', () => {
    // Without escape handling the string closes at the `\"` and the next `}` ends the object two
    // characters early — a truncation that still parses, which is the worst kind.
    assert.equal(firstJsonObject(String.raw`[{"a": "x\"}"}]`), String.raw`{"a": "x\"}"}`);
  });

  it('handles nesting', () => {
    assert.equal(firstJsonObject('{"a": {"b": 1}}'), '{"a": {"b": 1}}');
  });

  it('returns null when the window ends before the object closes — the envelope case', () => {
    assert.equal(firstJsonObject('{"text": "a very long payload that never'), null);
  });

  it('returns null when there is no object at all', () => {
    assert.equal(firstJsonObject('[1, 2, 3]'), null);
  });
});

describe('inspectFirstWindow — both real shapes, and a refusal for anything else', () => {
  it('recognises the bare array (course-files, 2026-10-05)', async () => {
    const shape = inspectFirstWindow(
      await readFirstWindow(fixture('course-files-components.json'))
    );

    assert.equal(shape.shape, 'bare');
    assert.equal(shape.firstComponent, 'row-private files');
    assert.equal(shape.declaresExternals, true);
  });

  it('recognises the MCP envelope and reads into its escaped payload (nsp-group-list)', async () => {
    const shape = inspectFirstWindow(
      await readFirstWindow(fixture('nsp-group-list-components.mcp.json'))
    );

    assert.equal(shape.shape, 'envelope');
    assert.equal(shape.firstComponent, 'Component 1');
    // The first component's dependencies are empty; a later one inside the same window is not.
    assert.equal(shape.declaresExternals, true);
  });

  it('NEGATIVE CONTROL: refuses a third shape, naming both shapes it expected', async () => {
    await assert.rejects(
      async () => inspectFirstWindow(await readFirstWindow(fixture('components-wrong-shape.json'))),
      /** @param {Error} error */ error => {
        assert.match(error.message, /bare JSON array of components/);
        assert.match(error.message, /MCP envelope/);
        return true;
      }
    );
  });

  it('NEGATIVE CONTROL: refuses an envelope whose payload is prose, not components', async () => {
    await assert.rejects(
      async () =>
        inspectFirstWindow(await readFirstWindow(fixture('components-envelope-unreadable.json'))),
      /payload is not a component list|carries no component object/
    );
  });

  it('NEGATIVE CONTROL: refuses an envelope whose payload holds an object that is not a component', () => {
    // The payload parses and holds a JSON object; it is simply not a component list. Without the
    // schema on this branch, the scanner would run over it and report whatever it found.
    const envelope = JSON.stringify([
      { type: 'text', text: JSON.stringify([{ id: 7, label: 'not a component' }]) }
    ]);

    assert.throws(() => inspectFirstWindow(envelope), /payload is not a component list/);
  });

  it('names the missing field when an envelope payload is nearly a component', () => {
    const envelope = JSON.stringify([
      { type: 'text', text: JSON.stringify([{ name: 'x', assetKey: 'k' }]) }
    ]);

    assert.throws(() => inspectFirstWindow(envelope), /dependencies/);
  });

  it('refuses an empty response', () => {
    assert.throws(() => inspectFirstWindow('   '), /empty response/);
  });

  it('refuses a component entry with no dependencies field', () => {
    assert.throws(
      () => inspectFirstWindow('[{"name": "x", "assetKey": "y"}]'),
      /dependencies|expected array/i
    );
  });

  it('refuses a dependency that does not declare externality — the original discriminator bug', () => {
    assert.throws(
      () =>
        inspectFirstWindow('[{"name": "x", "dependencies": [{"name": "Cell", "assetKey": "k"}]}]'),
      /external|expected boolean/i
    );
  });

  it('accepts a component whose dependencies are empty, because many are', () => {
    assert.equal(
      inspectFirstWindow('[{"name": "x", "dependencies": []}]').declaresExternals,
      false
    );
  });
});

describe('readFirstWindow — one window, whatever the file size is', () => {
  it('reads at most WINDOW bytes from a file many times larger', async () => {
    const path = fixture('components-large-streaming.json'),
      window = await readFirstWindow(path);

    assert.ok(statSync(path).size > 4 * WINDOW, 'the fixture is not large enough to prove this');
    assert.equal(Buffer.byteLength(window, 'utf8'), WINDOW);
  });

  it('reads a short file whole, without padding it', async () => {
    const path = fixture('components-wrong-shape.json');

    assert.equal(Buffer.byteLength(await readFirstWindow(path), 'utf8'), statSync(path).size);
  });
});

describe('the stream survives the boundary', () => {
  it('finds an external that lies past the first window', async () => {
    const path = fixture('components-large-streaming.json'),
      window = await readFirstWindow(path);

    // The validated window contains no external at all; the only one is 200 KB further in. A
    // validator that had become the reader would miss it, and the verdict would be `undecided`.
    assert.equal(inspectFirstWindow(window).declaresExternals, false);
    assert.deepEqual([...(await externalsOf(path)).keys()], ['sl-button-pill']);
  });

  it('decides strict on it, through the CLI path, with the shape recorded', async () => {
    const verdict = await decide({
      fileKey: 'LARGE',
      from: fixture('components-large-streaming.json'),
      cache: mkdtempSync(join(tmpdir(), 'mode-large-'))
    });

    assert.equal(verdict.mode, 'strict');
    assert.equal(verdict.shape, 'bare');
  });

  it('records which shape each stored fixture was read as', async () => {
    const bare = await decide({
        fileKey: 'COURSE',
        from: fixture('course-files-components.json'),
        cache: mkdtempSync(join(tmpdir(), 'mode-bare-'))
      }),
      envelope = await decide({
        fileKey: 'NSP',
        from: fixture('nsp-group-list-components.mcp.json'),
        cache: mkdtempSync(join(tmpdir(), 'mode-env-'))
      });

    assert.equal(bare.shape, 'bare');
    assert.equal(bare.mode, 'as-is');
    assert.deepEqual(bare.evidence.other, ['.Main menu', '.Navigation item', 'Cell', 'your-files']);

    assert.equal(envelope.shape, 'envelope');
    assert.equal(envelope.mode, 'strict');
    assert.equal(envelope.evidence.sldsCount, 7);
  });
});

describe('NEGATIVE CONTROL: the exact defect that shipped, as a check', () => {
  it('stays silent when the scanner can read what the window declared', async () => {
    // The check must not fire on a healthy response, or it becomes an obstacle rather than a
    // control. Both key orders here are ones the scanner handles.
    const dir = mkdtempSync(join(tmpdir(), 'mode-healthy-')),
      path = join(dir, 'components.json');

    writeFileSync(
      path,
      '[{"name": "x", "dependencies": [{"name": "Cell", "external": true}]},\n' +
        '{"name": "y", "dependencies": [{"external": true, "name": "sl-icon"}]}]\n'
    );

    const verdict = await decide({ fileKey: 'HEALTHY', from: path, cache: dir });

    assert.equal(verdict.mode, 'strict');
    assert.deepEqual(verdict.evidence.slds, ['sl-icon']);
    assert.deepEqual(verdict.evidence.other, ['Cell']);
  });

  it('throws, rather than reporting undecided, when the window declares and the scan is empty', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mode-zero-')),
      path = join(dir, 'components.json');

    // `external` and `true` separated by a comment-like gap the pattern does not accept: the
    // shape is valid, the declaration is visible to the window check, and the scanner reaches
    // none of them.
    writeFileSync(
      path,
      '[{"name": "x", "dependencies": [{"name": "Cell", "external": true}]}]'.replace(
        '"name": "Cell", "external": true',
        '"name": "Cell", "assetKey": "k", "external": true'
      )
    );

    await assert.rejects(
      () => decide({ fileKey: 'ZERO', from: path, cache: dir }),
      /the reader is wrong, not the file/
    );
  });
});
