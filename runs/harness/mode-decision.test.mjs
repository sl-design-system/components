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
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { classify, decide, externalsOf } from './mode-decision.mjs';

/**
 * The shape a live response actually has — a bare array, each entry's `dependencies` carrying `{
 * name, external, assetKey }`. Captured 2026-10-05 from `mONnHPTYNNaBwV3cFUHIYv` and kept verbatim
 * in `fixtures/course-files-components.json`, which the last test reads.
 */
const file = components => components;
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
