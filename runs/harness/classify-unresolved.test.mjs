/**
 * The classifier replaces a halt with a diagnosis, so the question every test asks is whether a
 * reader would be sent to the right person — and whether the answer would still be the same
 * tomorrow. The control's counts moved by up to threefold between two passes of one design; nothing
 * here infers from appearance, and these tests are what holds that line.
 *
 * Every component name in the fixtures is a name that really appears in the nineteen-run corpus,
 * and the suggestions fixture is a response the Dev Mode server really sent.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  CAUSES,
  DEFAULT_INVENTORY,
  classify,
  diagnose,
  matchComponent,
  normaliseName,
  parseSuggestions,
  readInventory
} from './classify-unresolved.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** @param {string} name */
const fixture = name => readFileSync(join(HERE, 'fixtures', name), 'utf8');

/** @param {string} name */
const walkFixture = name => JSON.parse(fixture(name));

const inventory = readInventory();

// =============================================================================================

describe('normaliseName — every rule is here because of a name in the corpus', () => {
  /** @type {[string, string][]} */
  const corpus = [
    ['sl-badge ', 'sl-badge'],
    ['sl-badge [DRAFT]', 'sl-badge'],
    ['sl-label-theme [DEPRECATED]', 'sl-label-theme'],
    ['sl-select (simple-prototype)', 'sl-select'],
    ['sl-button-bar/Rectangle', 'sl-button-bar'],
    ['sl-card Actionable', 'sl-card'],
    ['SL-card', 'sl-card'],
    ['sl_base-text_input', 'sl-base-text-input'],
    ['sl-grid-quick-grid', 'sl-grid-quick-grid'],
    // Every bracketed or parenthesised name in the corpus has a space before it, so the word
    // split would handle those on its own. These two cover the un-spaced form the bracket and
    // parenthesis rules exist for, which nothing has sent us yet.
    ['sl-badge[DRAFT]', 'sl-badge'],
    ['sl-select(simple-prototype)', 'sl-select']
  ];

  for (const [raw, expected] of corpus) {
    it(`reads ${JSON.stringify(raw)} as ${expected}`, () => {
      assert.equal(normaliseName(raw), expected);
    });
  }
});

describe('readInventory — what this repository actually publishes', () => {
  it('reads the published mappings from disk, with the node ids in their url comments', () => {
    const badge = inventory.published.get('sl-badge');

    assert.equal(badge?.file, 'badge.figma.ts');
    assert.deepEqual(badge?.nodeIds, ['1870:150559']);
  });

  it('reads the batch manifest as well as the single files', () => {
    const button = inventory.published.get('sl-button');

    assert.equal(button?.file, 'button.figma.batch.ts');
    assert.equal((button?.nodeIds.length ?? 0) > 1, true);
  });

  it('keeps a scaffold apart from a published mapping', () => {
    // `figma.config.json` includes `*.figma.ts` and `*.figma.batch.json` and nothing else, so a
    // `.figma.scaffold.ts` is declared and not published — a different answer for a reader.
    assert.equal(inventory.scaffolded.get('sl-tree'), 'tree.figma.scaffold.ts');
    assert.equal(inventory.published.has('sl-tree'), false);
  });

  it('does not mistake a batch template for a single mapping', () => {
    assert.equal(inventory.published.get('sl-button')?.file.endsWith('.batch.ts'), true);
    assert.equal(
      [...inventory.published.keys()].some(key => key.includes('.batch')),
      false
    );
  });

  it('NEGATIVE CONTROL: refuses a directory that publishes no mapping at all', () => {
    assert.throws(
      () => readInventory(mkdtempSync(join(tmpdir(), 'empty-'))),
      /publishes no Code Connect mapping/
    );
  });

  it('NEGATIVE CONTROL: refuses a batch manifest of the wrong shape', () => {
    const dir = mkdtempSync(join(tmpdir(), 'batch-'));

    writeFileSync(join(dir, 'badge.figma.ts'), '// url=…node-id=1-2\n');
    writeFileSync(
      join(dir, 'components.figma.batch.json'),
      '[{"templateFile":"./x.figma.batch.ts"}]'
    );

    assert.throws(() => readInventory(dir));
  });
});

describe('matchComponent — three tiers, and it says which one answered', () => {
  it('matches a name that is exactly a mapping', () => {
    assert.deepEqual(matchComponent('sl-badge [DRAFT]', inventory), {
      component: 'sl-badge',
      how: 'exact',
      state: 'published',
      file: 'badge.figma.ts'
    });
  });

  it('matches the same letters hyphenated differently', () => {
    // The corpus draws it `sl-searchfield`; the design system publishes `sl-search-field`.
    const match = matchComponent('sl-searchfield', inventory);

    assert.equal(match.component, 'sl-search-field');
    assert.equal(match.how, 'hyphenation');
  });

  it('falls back to a prefix, and labels it as the weaker answer it is', () => {
    const match = matchComponent('sl-button-pill', inventory);

    assert.equal(match.component, 'sl-button');
    assert.equal(match.how, 'prefix');
  });

  it('matches a variant of a mapped component exactly, before any prefix is tried', () => {
    const match = matchComponent('sl-button-bar/Rectangle', inventory);

    assert.equal(match.component, 'sl-button-bar');
    assert.equal(match.how, 'exact');
  });

  it('prefers the longest prefix, so the more specific mapping wins', () => {
    // Two keys are prefixes of this name — `sl-button` and `sl-button-bar`. Nothing in the
    // corpus has two candidates yet, and the order is the difference between routing a reader
    // to the button mapping and to the button-bar one.
    const match = matchComponent('sl-button-bar-compact', inventory);

    assert.equal(match.component, 'sl-button-bar');
    assert.equal(match.how, 'prefix');
  });

  it('reports a scaffold as scaffolded rather than as published', () => {
    assert.deepEqual(matchComponent('sl-tree', inventory), {
      component: 'sl-tree',
      how: 'exact',
      state: 'scaffolded',
      file: 'tree.figma.scaffold.ts'
    });
  });

  it('finds nothing for a component from another library', () => {
    assert.deepEqual(matchComponent('Cell', inventory), {
      component: null,
      how: 'none',
      state: 'absent',
      file: null
    });
  });

  it('does not match a name on a partial word', () => {
    // `sl-iconography` is not `sl-icon`; the prefix tier requires a hyphen boundary.
    assert.equal(matchComponent('sl-iconography', inventory).component, null);
  });
});

// =============================================================================================

describe('diagnose — the five causes, each from evidence', () => {
  /** @param {object} node @param {string} mode */
  const of = (node, mode) =>
    diagnose({ id: '1:1', name: null, reason: null, ...node }, { mode, inventory });

  it('A — the map was never read', () => {
    const diagnosis = of({ reason: 'map-unreadable', name: 'sl-badge' }, 'strict');

    assert.equal(diagnosis.cause, 'retrieval-failed');
    assert.equal(CAUSES[diagnosis.cause].owner, 'pipeline');
  });

  it('A outranks everything, because the rest would be standing on it', () => {
    // An as-is file whose map could not be read is still our bug, not the second audience.
    assert.equal(of({ reason: 'map-unreadable', name: 'Cell' }, 'as-is').cause, 'retrieval-failed');
  });

  it('B — the server emits an id it will not accept', () => {
    assert.equal(
      of({ reason: 'nested-id-not-probeable', name: 'sl-base-label' }, 'strict').cause,
      'nested-id-rejected'
    );
  });

  it('C — the file is drawn in another library', () => {
    const diagnosis = of({ reason: 'genuinely-unmapped', name: 'Cell' }, 'as-is');

    assert.equal(diagnosis.cause, 'another-library');
    assert.equal(CAUSES[diagnosis.cause].owner, 'nobody');
  });

  it('C records a name that disagrees with the mode rather than smoothing it over', () => {
    const diagnosis = of({ reason: 'genuinely-unmapped', name: 'sl-badge' }, 'as-is');

    assert.equal(diagnosis.cause, 'another-library');
    assert.match(diagnosis.evidence, /the mode is as-is, yet sl-badge matches badge\.figma\.ts/);
  });

  it('D — a scaffold is declared and not published', () => {
    const diagnosis = of({ reason: 'genuinely-unmapped', name: 'sl-tree' }, 'strict');

    assert.equal(diagnosis.cause, 'no-mapping-written');
    assert.match(diagnosis.evidence, /tree\.figma\.scaffold\.ts is a scaffold/);
  });

  it('D — nothing in the inventory stands for it', () => {
    const diagnosis = of({ reason: 'genuinely-unmapped', name: 'Cell' }, 'strict');

    assert.equal(diagnosis.cause, 'no-mapping-written');
    assert.match(diagnosis.evidence, /no mapping file stands for cell/);
  });

  it('E — a mapping is published and the node did not resolve anyway', () => {
    const diagnosis = of({ reason: 'genuinely-unmapped', name: 'sl-badge [DRAFT]' }, 'strict');

    assert.equal(diagnosis.cause, 'mapping-stale');
    assert.equal(CAUSES[diagnosis.cause].owner, 'design-system-team');
    assert.match(diagnosis.evidence, /badge\.figma\.ts publishes a mapping/);
  });

  it('E carries the tier that matched, so a prefix answer can be discounted', () => {
    assert.match(
      of({ reason: 'genuinely-unmapped', name: 'sl-button-pill' }, 'strict').evidence,
      /matched by prefix/
    );
  });

  it('D and E say different things to the same team', () => {
    assert.notEqual(CAUSES['no-mapping-written'].remedy, CAUSES['mapping-stale'].remedy);
    assert.equal(CAUSES['no-mapping-written'].owner, CAUSES['mapping-stale'].owner);
  });

  it('every cause names an owner and a remedy', () => {
    for (const [cause, detail] of Object.entries(CAUSES)) {
      assert.equal(typeof detail.owner, 'string', cause);
      assert.equal(detail.remedy.length > 10, true, cause);
      assert.match(detail.letter, /^[A-E]$/);
    }
    assert.equal(Object.keys(CAUSES).length, 5);
  });
});

// =============================================================================================

describe('parseSuggestions — the payload, and the prompt wrapped around it', () => {
  const response = fixture('suggestions-sticky-toc.txt');

  it('reads every suggestion the server really sent', () => {
    const { suggestions } = parseSuggestions(response);

    assert.equal(suggestions.length, 135);
    assert.deepEqual(suggestions[0], {
      name: 'Sticky TOC',
      nodeId: '4187:43000',
      properties: {}
    });
  });

  it('reads a properties object that spans many lines', () => {
    const { suggestions } = parseSuggestions(response),
      select = suggestions.find(one => one.nodeId === '4195:33202');

    assert.deepEqual(select?.properties, { Label: 'true', 'Validation message': 'false' });
  });

  it('keeps the prompt apart from the payload, and keeps it as a string', () => {
    const { prompt } = parseSuggestions(response);

    assert.equal(prompt.length > 0, true);
    assert.equal(
      prompt.some(block => block.includes('send_code_connect_mappings')),
      true
    );
    // The response ends by instructing an agent to call a write tool against the user's Figma
    // file. It is returned so a caller can see it arrived, and nothing in this module reads it
    // as anything but text.
    assert.equal(
      prompt.every(block => typeof block === 'string'),
      true
    );
  });

  it('NEGATIVE CONTROL: refuses a response carrying no suggestion', () => {
    assert.throws(
      () => parseSuggestions('Your task is to find the best matching component.'),
      /carries no suggestion at all/
    );
  });

  it('NEGATIVE CONTROL: refuses a suggestion whose properties never close', () => {
    assert.throws(
      () => parseSuggestions('Component: x\nNode ID: 1:1\nProperties: {"a": "b"'),
      /1:1: the suggestion carries no properties object/
    );
  });
});

// =============================================================================================

describe('a nested node is never its own finding', () => {
  /**
   * One enclosing instance and `count` nested children below it.
   *
   * @param {{
   *   outcome: string | null;
   *   disposition: string;
   *   reason: string | null;
   *   count?: number;
   *   name?: string;
   * }} input
   */
  const walkOf = ({ outcome, disposition, reason, count = 1, name = 'Cell' }) => ({
    rootId: '1:1',
    nodes: [
      { id: '1:1', name: 'root', disposition: 'root', reason: null, probedAs: null },
      { id: '2:2', name, disposition, reason, probedAs: '2:2' },
      ...Array.from({ length: count }, (_, i) => ({
        id: `I2:2;3:${i}`,
        name: 'Label',
        disposition: 'nested',
        reason: 'nested-id-not-probeable',
        probedAs: '2:2',
        detail: outcome === null ? null : `answered by 2:2: ${outcome}`,
        ...(outcome === null ? {} : { enclosingOutcome: outcome })
      }))
    ]
  });

  /** @param {object} walk @param {string} [mode] */
  const run = (walk, mode = 'as-is') => classify({ walk, mode, modeSource: 'flag', inventory });

  it('is absent when its enclosing instance is another library', () => {
    const report = run(
      walkOf({ outcome: 'empty', disposition: 'descended', reason: 'genuinely-unmapped' })
    );

    assert.deepEqual(report.counts.byCause, { 'C another-library': 1 });
    assert.deepEqual(report.counts.byOwner, { nobody: 1 });
  });

  it('is absent when its enclosing instance could not be read', () => {
    const report = run(
      walkOf({ outcome: 'unreadable', disposition: 'descended', reason: 'map-unreadable' })
    );

    assert.deepEqual(report.counts.byCause, { 'A retrieval-failed': 1 });
  });

  it('is absent when its enclosing instance is a missing mapping', () => {
    const report = run(
      walkOf({
        outcome: 'empty',
        disposition: 'descended',
        reason: 'genuinely-unmapped',
        name: 'sl-tree'
      }),
      'strict'
    );

    assert.deepEqual(report.counts.byOwner, { 'design-system-team': 1 });
  });

  it('tells the enclosing finding how many sat beneath it', () => {
    const report = run(
      walkOf({ outcome: 'empty', disposition: 'descended', reason: 'genuinely-unmapped', count: 3 })
    );

    assert.equal(report.unresolved[0].nestedBelow, 3);
    assert.equal(report.counts.nestedWithEnclosing, 3);
  });

  it("leaves T-08's count meaning what it meant — only what answered", () => {
    const answered = run(
        walkOf({ outcome: 'resolved', disposition: 'resolved', reason: null, count: 2 })
      ),
      unanswered = run(
        walkOf({
          outcome: 'empty',
          disposition: 'descended',
          reason: 'genuinely-unmapped',
          count: 2
        })
      );

    assert.equal(answered.counts.coveredByEnclosing, 2);
    assert.equal(unanswered.counts.coveredByEnclosing, 0);
    assert.equal(unanswered.counts.nestedWithEnclosing, 2);
  });

  it('attributes the count to the node it sat below, not to a node that names it', () => {
    // An orphan's `probedAs` is its own outermost segment, so it can collide with a real node's
    // id. Keying the count by `probedAs` instead of `id` gives the orphan a count that belongs
    // to somebody else.
    const walk = {
        rootId: '1:1',
        nodes: [
          { id: '1:1', name: 'root', disposition: 'root', reason: null, probedAs: null },
          {
            id: '9:9',
            name: 'Cell',
            disposition: 'descended',
            reason: 'genuinely-unmapped',
            probedAs: '9:9'
          },
          {
            id: 'I9:9;7:7',
            name: 'Label',
            disposition: 'nested',
            reason: 'nested-id-not-probeable',
            probedAs: '9:9',
            detail: 'answered by 9:9: empty',
            enclosingOutcome: 'empty'
          },
          // an orphan whose outermost segment happens to be the same node
          {
            id: 'I9:9;8:8',
            name: 'Stray',
            disposition: 'nested',
            reason: 'nested-id-not-probeable',
            probedAs: '9:9',
            detail: null
          }
        ]
      },
      report = run(walk);

    assert.equal(report.unresolved.find(node => node.id === '9:9')?.nestedBelow, 1);
    assert.equal(report.unresolved.find(node => node.id === 'I9:9;8:8')?.nestedBelow, 0);
  });

  describe('NEGATIVE CONTROL: an orphan is still ours, and still halts', () => {
    it('keeps cause B for a nested id the walk found no parent for', () => {
      const report = run(
          walkOf({ outcome: null, disposition: 'descended', reason: 'genuinely-unmapped' })
        ),
        hit = report.unresolved.find(node => node.id === 'I2:2;3:0');

      assert.equal(hit?.letter, 'B');
      assert.equal(hit?.owner, 'pipeline');
    });

    it('and the enclosing finding does not claim it', () => {
      const report = run(
        walkOf({ outcome: null, disposition: 'descended', reason: 'genuinely-unmapped' })
      );

      assert.equal(report.counts.nestedWithEnclosing, 0);
      assert.equal(report.unresolved.find(node => node.id === '2:2')?.nestedBelow, 0);
    });
  });
});

describe('a node inside an instance that answered is not unresolved', () => {
  /** @param {string} enclosingOutcome @param {string} [detail] */
  const walkWithNested = (enclosingOutcome, detail = `answered by 2:2: ${enclosingOutcome}`) => ({
    rootId: '1:1',
    nodes: [
      { id: '1:1', name: 'root', disposition: 'root', reason: null, probedAs: null },
      {
        id: '2:2',
        name: 'sl-avatar',
        disposition: enclosingOutcome === 'empty' ? 'descended' : enclosingOutcome,
        reason: enclosingOutcome === 'empty' ? 'genuinely-unmapped' : null,
        probedAs: '2:2'
      },
      {
        id: 'I2:2;3:3',
        name: 'Mask',
        disposition: 'nested',
        reason: 'nested-id-not-probeable',
        probedAs: '2:2',
        detail,
        enclosingOutcome: enclosingOutcome === 'empty' ? 'empty' : enclosingOutcome
      }
    ]
  });

  /** @param {ReturnType<typeof walkWithNested>} walk */
  const run = walk => classify({ walk, mode: 'strict', modeSource: 'flag', inventory });

  it('drops a nested node whose enclosing instance resolved', () => {
    const report = run(walkWithNested('resolved'));

    assert.equal(
      report.unresolved.some(node => node.id === 'I2:2;3:3'),
      false
    );
    assert.equal(report.counts.coveredByEnclosing, 1);
  });

  it('drops one whose enclosing instance was mapped, which also answered', () => {
    const report = run(walkWithNested('mapped'));

    assert.equal(
      report.unresolved.some(node => node.id === 'I2:2;3:3'),
      false
    );
  });

  it('reads the field, not the prose beside it', () => {
    // A classifier that parsed `detail` would be the next defect of this shape. Changing the
    // sentence must change nothing.
    const report = run(walkWithNested('resolved', 'the enclosing instance exploded'));

    assert.equal(
      report.unresolved.some(node => node.id === 'I2:2;3:3'),
      false
    );
  });

  describe('NEGATIVE CONTROL: cause B survives for the case it was written for', () => {
    it('does not cover a nested node whose enclosing instance answered nothing', () => {
      // **This asserted cause B until `T-NOJIRA-figma-ingestion-09`.** That task narrowed cause
      // B to the orphan: an instance that answered `{}` has a finding of its own — here cause
      // C, another library — and its child is counted against that finding rather than given a
      // second one with a different owner. What this control still proves is that `empty` is
      // not an *answer*: `coveredByEnclosing` stays at zero.
      const report = run(walkWithNested('empty'));

      assert.equal(report.counts.coveredByEnclosing, 0);
      assert.equal(report.counts.nestedWithEnclosing, 1);
      assert.equal(
        report.unresolved.some(node => node.id === 'I2:2;3:3'),
        false
      );
    });

    it('keeps one with no enclosing outcome recorded at all — an older walk', () => {
      const walk = walkWithNested('resolved');

      walk.nodes[2].enclosingOutcome = /** @type {string | undefined} */ (undefined);

      assert.equal(run(walk).unresolved.find(node => node.id === 'I2:2;3:3')?.letter, 'B');
    });
  });
});

// =============================================================================================

describe('classify — every unresolved node carries a cause and an owner', () => {
  const walk = walkFixture('walk-five-causes.json');

  /** @param {string} mode */
  const run = mode => classify({ walk, mode, modeSource: 'flag', inventory });

  it('gives the causes on a walk that contains all five', () => {
    // **`B nested-id-rejected: 1` left this list**, and the number that moved is the point of
    // `T-NOJIRA-figma-ingestion-08`. The one nested node here sits inside `334:20668`, which
    // resolved with a snippet — so nothing about it is unresolved, and reporting it as a
    // pipeline bug was telling us to fix something that had already worked.
    assert.deepEqual(run('strict').counts.byCause, {
      'A retrieval-failed': 1,
      'D no-mapping-written': 2,
      'E mapping-stale': 2
    });
  });

  it('counts what the enclosing instance covered rather than dropping it silently', () => {
    assert.equal(run('strict').counts.coveredByEnclosing, 1);
  });

  it('leaves no node without an owner and a remedy', () => {
    for (const node of run('strict').unresolved) {
      assert.equal(typeof node.owner, 'string');
      assert.equal(node.remedy.length > 10, true);
      assert.equal(node.evidence.length > 10, true);
    }
  });

  it('does not list a node Code Connect resolved', () => {
    const report = run('strict');

    assert.equal(
      report.unresolved.some(node => node.id === '334:20668'),
      false
    );
    assert.equal(report.counts.unresolved, 5);
  });

  it('turns the mapping gaps into another library when the file is as-is', () => {
    assert.deepEqual(run('as-is').counts.byCause, {
      'A retrieval-failed': 1,
      'C another-library': 4
    });
  });

  it('says where the mode came from, so a reader can see what it rests on', () => {
    assert.equal(
      classify({ walk, mode: 'strict', modeSource: 'verdict', inventory }).modeSource,
      'verdict'
    );
  });

  it('carries F3b and rejects F4 in the artifact, not only in a document', () => {
    const { notes } = run('strict');

    assert.match(notes.F3b, /carried, not detected/);
    assert.match(notes.F3b, /Properties object per node/);
    assert.match(notes.F4, /rejected here/);
  });

  it('NEGATIVE CONTROL: refuses a mode it was not given', () => {
    assert.throws(
      () => classify({ walk, mode: 'probably-strict', modeSource: 'flag', inventory }),
      /is not a mode; T-NOJIRA-figma-ingestion-01 decides/
    );
  });

  it('NEGATIVE CONTROL: refuses a walk that is not one', () => {
    assert.throws(() =>
      classify({ walk: { rootId: '1:1' }, mode: 'strict', modeSource: 'flag', inventory })
    );
  });
});

describe('classify — the internals of the library do not become this design’s problem', () => {
  const walk = walkFixture('walk-five-causes.json'),
    suggestions = parseSuggestions(fixture('suggestions-sticky-toc.txt'));

  it('counts a suggested id the walk never saw as the library’s, not the design’s', () => {
    // 135 suggestions for a walk of 13 instances. The traversal is the discriminator: an id it
    // never met is a node of the library the design consumes, and counting those here is how
    // one walk becomes a hundred and thirty-five findings.
    const live = classify({
      walk: walkFixture('walk-live-sticky-toc.json'),
      mode: 'strict',
      modeSource: 'flag',
      inventory,
      suggestions
    });

    assert.equal(live.suggestions?.total, 135);
    assert.equal(live.suggestions?.inDesign, 14);
    assert.equal(live.suggestions?.libraryInternal, 121);
    assert.equal(live.counts.unresolved, 28);
  });

  it('none of the library’s internals appears in the unresolved list', () => {
    const live = classify({
      walk: walkFixture('walk-live-sticky-toc.json'),
      mode: 'strict',
      modeSource: 'flag',
      inventory,
      suggestions
    });

    assert.deepEqual(
      live.unresolved.filter(node => node.id.startsWith('5383:')),
      []
    );
  });

  it('reports no suggestion block when none was given, rather than zero', () => {
    assert.equal(
      classify({ walk, mode: 'strict', modeSource: 'flag', inventory }).suggestions,
      null
    );
  });
});

describe('classify — the same inputs give the same answer', () => {
  it('is byte-identical across two passes', () => {
    // The control's blocked-node counts moved by up to threefold between two passes of one
    // design. Nothing in this classifier reads appearance, times anything, or walks a directory
    // in filesystem order, so two passes cannot disagree.
    const once = classify({
        walk: walkFixture('walk-five-causes.json'),
        mode: 'strict',
        modeSource: 'flag',
        inventory
      }),
      twice = classify({
        walk: walkFixture('walk-five-causes.json'),
        mode: 'strict',
        modeSource: 'flag',
        inventory: readInventory()
      });

    assert.equal(JSON.stringify(once), JSON.stringify(twice));
  });
});

// =============================================================================================

const SCRIPT = join(HERE, 'classify-unresolved.mjs');

/** @param {string[]} args */
const run = args =>
  /** @type {Promise<{ code: number; stdout: string; stderr: string }>} */ (
    new Promise(resolve => {
      execFile(
        process.execPath,
        [SCRIPT, ...args],
        { maxBuffer: 1024 * 1024 * 16 },
        /** @param {any} error */ (error, stdout, stderr) =>
          resolve({ code: error?.code ?? 0, stdout, stderr })
      );
    })
  );

const WALK = join(HERE, 'fixtures', 'walk-five-causes.json'),
  GAP = join(HERE, 'fixtures', 'walk-mapping-gap-only.json'),
  VERDICT = join(HERE, 'fixtures', 'mode-verdict-strict.json');

describe('NEGATIVE CONTROL: the CLI leaves by a non-zero exit when it does not know', () => {
  it('exits 2 when no walk is named', async () => {
    const { code, stderr } = await run([]);

    assert.equal(code, 2);
    assert.match(stderr, /usage: classify-unresolved\.mjs/);
  });

  it('exits 1 rather than guessing a mode nobody decided', async () => {
    const { code, stderr } = await run(['--walk', WALK]);

    assert.equal(code, 1);
    assert.match(stderr, /the mode is not known/);
  });

  it('takes the mode from a real mode-decision verdict and says so', async () => {
    const { stdout } = await run(['--walk', GAP, '--verdict', VERDICT, '--no-halt']),
      report = JSON.parse(stdout);

    assert.equal(report.mode, 'strict');
    assert.equal(report.modeSource, 'verdict');
  });

  it('exits 6 when anything on the list is our own bug', async () => {
    // Ours first. A diagnosis standing on a map we never read would send the design system team
    // after our failure.
    //
    // **This was `pipeline: 2` before `T-NOJIRA-figma-ingestion-08`.** The one that left was a
    // node inside an instance that resolved with a snippet; cause A, a map that could not be
    // read, is the one that is really ours and it still exits 6. The control survives the fix,
    // which is what it is here to do.
    const { code, stdout } = await run(['--walk', WALK, '--mode', 'strict']);

    assert.equal(code, 6);
    assert.equal(JSON.parse(stdout).counts.byOwner.pipeline, 1);
  });

  it('exits 0 on an as-is walk of another library and the nested ids beneath it', async () => {
    const walk = {
        rootId: '1:1',
        nodes: [
          { id: '1:1', name: 'root', disposition: 'root', reason: null, probedAs: null },
          {
            id: '2:2',
            name: 'Cell',
            disposition: 'descended',
            reason: 'genuinely-unmapped',
            probedAs: '2:2'
          },
          {
            id: 'I2:2;3:3',
            name: 'Label',
            disposition: 'nested',
            reason: 'nested-id-not-probeable',
            probedAs: '2:2',
            detail: 'answered by 2:2: empty',
            enclosingOutcome: 'empty'
          }
        ]
      },
      path = join(mkdtempSync(join(tmpdir(), 'slds-asis-')), 'walk.json');

    writeFileSync(path, JSON.stringify(walk));

    const { code, stdout } = await run(
      [path ? '--walk' : '', path, '--mode', 'as-is'].filter(Boolean)
    );

    assert.equal(code, 0);
    assert.deepEqual(JSON.parse(stdout).counts.byOwner, { nobody: 1 });
  });

  it('exits 0 on a walk whose only nested nodes sit inside instances that answered', async () => {
    const walk = {
        rootId: '1:1',
        nodes: [
          { id: '1:1', name: 'root', disposition: 'root', reason: null, probedAs: null },
          { id: '2:2', name: 'sl-avatar', disposition: 'resolved', reason: null, probedAs: '2:2' },
          {
            id: 'I2:2;3:3',
            name: 'Mask',
            disposition: 'nested',
            reason: 'nested-id-not-probeable',
            probedAs: '2:2',
            detail: 'answered by 2:2: resolved',
            enclosingOutcome: 'resolved'
          }
        ]
      },
      path = join(mkdtempSync(join(tmpdir(), 'slds-covered-')), 'walk.json');

    writeFileSync(path, JSON.stringify(walk));

    const { code, stdout } = await run(['--walk', path, '--mode', 'strict']);

    assert.equal(code, 0);
    assert.equal(JSON.parse(stdout).counts.unresolved, 0);
    assert.equal(JSON.parse(stdout).counts.coveredByEnclosing, 1);
  });

  it('exits 5 on a strict file whose only problem is a missing mapping', async () => {
    const { code, stdout } = await run(['--walk', GAP, '--verdict', VERDICT]);

    assert.equal(code, 5);
    assert.deepEqual(JSON.parse(stdout).counts.byOwner, { 'design-system-team': 2 });
  });

  it('exits 0 on that same file in as-is mode — the halt is the mode, not the design', async () => {
    const { code, stdout } = await run(['--walk', GAP, '--mode', 'as-is']);

    assert.equal(code, 0);
    assert.deepEqual(JSON.parse(stdout).counts.byCause, { 'C another-library': 2 });
  });

  it('exits 0 in strict mode when the operator already knows', async () => {
    const { code } = await run(['--walk', GAP, '--verdict', VERDICT, '--no-halt']);

    assert.equal(code, 0);
  });

  it('exits 1 when the inventory it was pointed at publishes nothing', async () => {
    const { code, stderr } = await run([
      '--walk',
      GAP,
      '--mode',
      'strict',
      '--inventory',
      mkdtempSync(join(tmpdir(), 'none-'))
    ]);

    assert.equal(code, 1);
    assert.match(stderr, /publishes no Code Connect mapping/);
  });

  it('uses this repository’s own mappings by default', () => {
    assert.match(DEFAULT_INVENTORY, /scripts\/connect-figma-components\/src$/);
  });
});
