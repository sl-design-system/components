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
import { describe, it } from 'node:test';
import { ADVISORIES, extractBlocks, splitAdvisoryTail } from './normalise-captures.mjs';

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

const codeOf = blocks => blocks.filter(block => block.part === 'code');
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
