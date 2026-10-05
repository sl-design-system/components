/**
 * The advisory split, tested against the shapes the corpus actually holds.
 *
 * Expected values come from `CAPTURE-PROTOCOL.md` and the task's acceptance criteria, never from
 * reading `extractBlocks` back. The two fixtures below are the two storage shapes measured across
 * the nineteen runs: a fenced response, where Figma's advisories land outside the fence and were
 * silently dropped, and an unfenced one, where they are concatenated onto the code with no
 * separator and a TSX parser rejects the file.
 *
 * Usage: node --test "runs/harness/*.test.mjs"
 */
import { strict as assert } from 'node:assert';
import { globSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  ADVISORIES,
  ADVISORY_KINDS,
  CaptureIndexSchema,
  CaptureSchema,
  validateIndex,
  extractBlocks,
  splitAdvisoryTail
} from './normalise-captures.mjs';
import { CaptureIndex as ReaderIndex } from './render-design.mjs';

/** The code half of a response: what a parser must receive, byte for byte. */
const CODE = `import svgPaths from "./svg-paths";

export default function Navigation() {
  return (
    <div className="flex" data-node-id="2422:87040">
      <p>Overview</p>
    </div>
  );
}`;

/**
 * The five advisory blocks, in the order the corpus shows them, joined exactly as Figma sends them
 * — **with no separator at all**. `…instructs you to do so.Node ids have been added…` is the real
 * byte sequence, not an abbreviation of one.
 */
const STACK =
  "SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.\n\n1. Analyze the target codebase\n   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.\n   ";
const NODE_IDS =
  'Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.';
const STYLES =
  'These styles are contained in the design: Body/md/regular: Font(family: "body", size: 14).';
const DESCRIPTIONS =
  'Component descriptions: The following components have usage descriptions or documentation links defined in Figma.\n\n## sl-icon\n\n**Node ID:** 2003:3302\n\nIcons communicate messages.\n';
const ASSETS =
  'Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.';

const ADVISORY_TEXT = STACK + NODE_IDS + STYLES + DESCRIPTIONS + ASSETS;

/** @param {{ part: string; kind?: string; text: string }[]} blocks */
const codeOf = blocks => blocks.filter(block => block.part === 'code');
/** @param {{ part: string; kind?: string; text: string }[]} blocks */
const advisoriesOf = blocks => blocks.filter(block => block.part === 'advisory');

describe('extractBlocks — the five advisory blocks are separate entries', () => {
  it('knows the five blocks the response carries', () => {
    assert.deepEqual(
      ADVISORIES.map(advisory => advisory.kind),
      ['stack-conversion', 'node-ids', 'styles', 'component-descriptions', 'assets']
    );
  });

  for (const [shape, text] of [
    ['unfenced', `# node 2422:87040\n\n${CODE}${ADVISORY_TEXT}`],
    ['fenced', `# node 2422:87040\n\n\`\`\`jsx\n${CODE}\n\`\`\`\n\n${ADVISORY_TEXT}`]
  ])
    describe(`a ${shape} response`, () => {
      const blocks = extractBlocks(text);

      it('yields one code entry and five advisory entries', () => {
        assert.equal(codeOf(blocks).length, 1);
        assert.equal(advisoriesOf(blocks).length, 5);
      });

      it('leaves the code block unchanged bytes — no advisory prose reaches a parser', () => {
        assert.equal(codeOf(blocks)[0].text.trimEnd(), CODE);

        for (const advisory of ADVISORIES)
          assert.ok(
            !codeOf(blocks)[0].text.includes(advisory.sentinel),
            `code block still carries the ${advisory.kind} advisory`
          );
      });

      it('names each advisory, so a reader can ask for the one it wants', () => {
        assert.deepEqual(
          advisoriesOf(blocks).map(block => block.kind),
          ['stack-conversion', 'node-ids', 'styles', 'component-descriptions', 'assets']
        );
      });

      it('splits them at the sentinel, with nothing run together', () => {
        const [stack, nodeIds, styles, descriptions, assets] = advisoriesOf(blocks).map(
          block => block.text
        );

        assert.equal(stack.trimEnd(), STACK.trimEnd());
        assert.equal(nodeIds, NODE_IDS);
        assert.equal(styles, STYLES);
        assert.equal(descriptions.trimEnd(), DESCRIPTIONS.trimEnd());
        assert.equal(assets, ASSETS);
      });
    });

  it('a response with no advisories yields the code alone', () => {
    const blocks = extractBlocks(`# node 1:2\n\n\`\`\`jsx\n${CODE}\n\`\`\`\n`);

    assert.equal(advisoriesOf(blocks).length, 0);
    assert.equal(codeOf(blocks)[0].text.trimEnd(), CODE);
  });

  it('recovers advisories that arrived ahead of the code, not only behind it', () => {
    const blocks = extractBlocks(`# node 1:2\n\n${DESCRIPTIONS}${STYLES}\n\n${CODE}`);

    assert.deepEqual(
      advisoriesOf(blocks).map(block => block.kind),
      ['component-descriptions', 'styles']
    );
    assert.equal(codeOf(blocks)[0].text.trimEnd(), CODE);
  });

  it('a response with prose and no code yields nothing', () => {
    assert.deepEqual(extractBlocks('# a note\n\nNothing was captured for this node.\n'), []);
  });
});

/**
 * One run split a single response across three files mid-syntax, so parts two and three open with
 * `<p className=` and never reach `extractBlocks` — they take the continuation branch instead. The
 * advisories ride on the **last** of those parts, which is why repairing only the fenced and
 * unfenced paths left two runs exactly as broken as before.
 */
describe('splitAdvisoryTail — a continuation carries the advisories too', () => {
  const FRAGMENT = `<p className="leading-[20px]">Overview</p>\n      </div>\n    </div>\n  );\n}`;

  it('keeps the fragment whole and lifts each advisory off its tail', () => {
    const { code, advisories } = splitAdvisoryTail(FRAGMENT + ADVISORY_TEXT);

    assert.equal(code, FRAGMENT);
    assert.deepEqual(
      advisories.map(advisory => advisory.kind),
      ['stack-conversion', 'node-ids', 'styles', 'component-descriptions', 'assets']
    );
  });

  it('returns a fragment with no advisories unchanged', () => {
    assert.deepEqual(splitAdvisoryTail(FRAGMENT), { code: FRAGMENT, advisories: [] });
  });
});

// ------------------------------------------------------------------------------------------
// The producer boundary, added by T-NOJIRA-harness-quality-04.

describe('ADVISORY_KINDS is derived, not copied', () => {
  it('names exactly the five sentinels, in the order the corpus shows them', () => {
    assert.deepEqual(ADVISORY_KINDS, [
      'stack-conversion',
      'node-ids',
      'styles',
      'component-descriptions',
      'assets'
    ]);
  });

  it('cannot drift from ADVISORIES, because it is computed from it', () => {
    assert.deepEqual(
      ADVISORY_KINDS,
      ADVISORIES.map(advisory => advisory.kind)
    );
  });
});

/** One well-formed capture, from which the malformed variants below differ by one field. */
const capture = () => ({
  call: 'get_design_context',
  part: 'code',
  nodeId: '2422:87052',
  label: '# sl-button-bar/Rectangle',
  file: 'captures-v2/design-context/2422-87052.txt',
  bytes: 463,
  capturedAt: '2026-10-05T17:00:59.746Z',
  truncated: false
});

describe('CaptureSchema — strict, because a typo is a field nobody ever sees', () => {
  it('accepts the shape the normaliser writes', () => {
    assert.equal(CaptureSchema.parse(capture()).call, 'get_design_context');
  });

  it('accepts an advisory entry with one of the five kinds', () => {
    assert.ok(
      CaptureSchema.safeParse({ ...capture(), part: 'advisory', advisory: 'styles' }).success
    );
  });

  it('accepts a reference entry, which has a note and no part at all', () => {
    const { part: _part, ...rest } = capture();

    assert.ok(CaptureSchema.safeParse({ ...rest, call: 'get_screenshot', note: 'x' }).success);
  });

  it('accepts a continuation, which names the node its first part rooted at', () => {
    assert.ok(CaptureSchema.safeParse({ ...capture(), continuationOf: '33130:92562' }).success);
  });

  it('NEGATIVE CONTROL: rejects an advisory kind that is not one of the five', () => {
    const result = CaptureSchema.safeParse({ ...capture(), part: 'advisory', advisory: 'styling' });

    assert.equal(result.success, false);
    assert.deepEqual(result.error?.issues[0].path, ['advisory']);
  });

  it('NEGATIVE CONTROL: rejects an unknown key alongside every required one', () => {
    // Every required field is present and correct; only the extra key is wrong. A permissive
    // schema accepts this, and the typo becomes a field no reader ever sees.
    const result = CaptureSchema.safeParse({ ...capture(), nodeID: '2422:87052' });

    assert.equal(result.success, false);
    assert.match(String(result.error?.issues[0].message), /unrecognized|unknown/i);
  });

  it('rejects a missing nodeId, where null is the way to say there is none', () => {
    const { nodeId: _nodeId, ...rest } = capture();

    assert.equal(CaptureSchema.safeParse(rest).success, false);
  });

  it('rejects a capturedAt that is not a timestamp', () => {
    assert.equal(
      CaptureSchema.safeParse({ ...capture(), capturedAt: '2026-10-05' }).success,
      false
    );
  });

  it('rejects a negative byte count', () => {
    assert.equal(CaptureSchema.safeParse({ ...capture(), bytes: -1 }).success, false);
  });
});

describe('CaptureIndexSchema — the whole artifact', () => {
  const index = () => ({
    schemaVersion: 1,
    run: 'a2-nsp-class-overview',
    figma: { rootNodeId: '2422:87039' },
    normalisedFrom: "the run's own files; nothing was fetched",
    captures: [capture()]
  });

  it('accepts an index with no captures, because a run that captured nothing is a fact', () => {
    assert.ok(CaptureIndexSchema.safeParse({ ...index(), captures: [] }).success);
  });

  it('accepts a null rootNodeId, which is how "no metadata" is spelled', () => {
    assert.ok(CaptureIndexSchema.safeParse({ ...index(), figma: { rootNodeId: null } }).success);
  });

  it('NEGATIVE CONTROL: rejects a future schemaVersion rather than reading it as version 1', () => {
    assert.equal(CaptureIndexSchema.safeParse({ ...index(), schemaVersion: 2 }).success, false);
  });

  it('names the offending capture by its position', () => {
    const result = CaptureIndexSchema.safeParse({
      ...index(),
      captures: [capture(), { ...capture(), bytes: 'lots' }]
    });

    assert.deepEqual(result.error?.issues[0].path, ['captures', 1, 'bytes']);
  });
});

describe('validateIndex — the check, on input a correct producer cannot emit', () => {
  const good = {
    schemaVersion: 1,
    run: 'a2-nsp-class-overview',
    figma: { rootNodeId: '2422:87039' },
    normalisedFrom: "the run's own files; nothing was fetched",
    captures: [capture()]
  };

  it('returns the index when it is well formed', () => {
    assert.equal(validateIndex(good, 'runs/x').run, 'a2-nsp-class-overview');
  });

  it('NEGATIVE CONTROL: throws, naming the run and the field, on a malformed index', () => {
    assert.throws(
      () => validateIndex({ ...good, captures: [{ ...capture(), bytes: 'lots' }] }, 'runs/x'),
      /** @param {Error} error */ error => {
        assert.match(error.message, /^runs\/x: the index this run produced is malformed/);
        assert.match(error.message, /captures\.0\.bytes/);
        return true;
      }
    );
  });

  it('NEGATIVE CONTROL: throws on an index that is not an object at all', () => {
    assert.throws(() => validateIndex([capture()], 'runs/y'), /runs\/y: .*malformed/);
  });

  it('names the root when the fault has no path', () => {
    assert.throws(() => validateIndex(null, 'runs/z'), /\(root\)/);
  });
});

describe('every committed index still satisfies the producer schema', () => {
  const indexes = globSync('runs/2026-10-01-*/captures-v2/index.json');

  it('finds all nineteen', () => {
    assert.equal(indexes.length, 19);
  });

  for (const path of indexes)
    it(`${path.split('/')[1]} validates`, () => {
      const result = CaptureIndexSchema.safeParse(JSON.parse(readFileSync(path, 'utf8')));

      assert.ok(result.success, JSON.stringify(result.error?.issues[0]));
    });
});

describe('the producer and the reader cannot drift apart', () => {
  it('what the normaliser writes is what render-design accepts', () => {
    // Two schemas on purpose: this one is strict and describes the artifact, the reader's is
    // narrow and validates only the fields it dereferences, so an older or hand-written index
    // still reads. Nothing but this assertion keeps the two in agreement.
    for (const path of globSync('runs/2026-10-01-*/captures-v2/index.json')) {
      const raw = JSON.parse(readFileSync(path, 'utf8'));

      assert.ok(CaptureIndexSchema.safeParse(raw).success, `producer rejected ${path}`);
      assert.ok(ReaderIndex.safeParse(raw).success, `reader rejected ${path}`);
    }
  });
});

describe('a capture with no advisory sentinel at all', () => {
  const text = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'capture-no-advisories.txt'),
    'utf8'
  );

  it('NEGATIVE CONTROL: yields one code block and no advisories, not a parse failure', () => {
    const blocks = extractBlocks(text);

    assert.deepEqual(
      blocks.map(block => block.part),
      ['code']
    );
    assert.equal(blocks[0].kind, undefined);
  });

  it('leaves the code byte-identical, so nothing was stripped looking for a sentinel', () => {
    assert.match(extractBlocks(text)[0].text, /^export default function Card\(\) \{/);
    assert.match(extractBlocks(text)[0].text, /\}\n$/);
  });

  it('and none of the five sentinels is anywhere in it, which is why this is the control', () => {
    for (const { sentinel } of ADVISORIES) assert.ok(!text.includes(sentinel));
  });
});
