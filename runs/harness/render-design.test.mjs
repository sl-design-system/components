/**
 * Unit tests for the completeness probe.
 *
 * Every expected value here is derived from the documented rule — "coordinates are relative to the
 * parent, so placing a region means summing the ancestor chain" — or from a fixture captured off a
 * real run, never read off the implementation. The two measurement controls at the foot of the file
 * are shown **failing on damaged input**, because a probe that only ever goes green against a good
 * input has not been tested; it has been demonstrated.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, it, after } from 'node:test';

import {
  ARBITRARY,
  CaptureIndex,
  CodeConnectSnippet,
  FABRICATED_FRAME,
  FIXED,
  Fragment,
  Html,
  blocksFromMarkdown,
  buildBody,
  buildDocument,
  buildReport,
  buildStylesheet,
  classToCss,
  classesIn,
  codeCaptures,
  escape,
  h,
  parseBoxes,
  placeRegion,
  readRegions,
  renderRegion,
  renderRegions,
  resolveFrame,
  stubSource,
  undefinedComponentsIn
} from './render-design.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');
const run = promisify(execFile);

/** @param {string} name */
const fixture = name => readFileSync(join(FIXTURES, name), 'utf8');

/** Scratch run directories, removed once the suite finishes. @type {string[]} */
const scratch = [];

after(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
});

/**
 * Build a throwaway run directory with one region and the metadata the caller chooses.
 *
 * @param {{ metadata: string; index?: string }} input
 */
const makeRun = ({ metadata, index }) => {
  const dir = mkdtempSync(join(tmpdir(), 'render-design-'));

  scratch.push(dir);
  mkdirSync(join(dir, 'captures'));
  writeFileSync(join(dir, 'figma-metadata.txt'), metadata);
  writeFileSync(
    join(dir, 'captures', '01-get_design_context.tsx'),
    'export default () => <div data-node-id="1:3">card</div>;\n'
  );
  writeFileSync(
    join(dir, 'captures', 'index.json'),
    index ??
      JSON.stringify({
        captures: [
          {
            file: 'captures/01-get_design_context.tsx',
            call: 'get_design_context',
            part: 'code',
            label: 'card',
            nodeId: '1:3'
          }
        ]
      })
  );

  return dir;
};

describe('escape and renderAttributes — markup cannot leak through an attribute', () => {
  it('escapes the four characters that would re-open a tag', () => {
    assert.equal(escape('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
  });

  it('renames the two JSX attributes HTML spells differently', () => {
    assert.equal(renderAttributesOf({ className: 'a', htmlFor: 'b' }), ' class="a" for="b"');
  });

  it('writes a true attribute bare and drops false, null and undefined', () => {
    assert.equal(
      renderAttributesOf({ hidden: true, open: false, alt: null, title: undefined }),
      ' hidden'
    );
  });

  it('drops an object-valued attribute rather than printing [object Object]', () => {
    assert.equal(renderAttributesOf({ style: { color: 'red' }, id: 'x' }), ' id="x"');
  });

  it('never emits children as an attribute', () => {
    assert.equal(renderAttributesOf({ children: 'text', id: 'x' }), ' id="x"');
  });
});

// `renderAttributes` is exercised through `h`, which is the only caller, so the assertions above
// read an element rather than an internal string.
/** @param {Record<string, unknown>} props */
const renderAttributesOf = props => {
  const markup = String(h('div', props));
  return markup.slice('<div'.length, markup.indexOf('>'));
};

describe('h — composition without a framework', () => {
  it('leaves a void element unclosed', () => {
    assert.equal(String(h('img', { src: 'x.png' })), '<img src="x.png">');
  });

  it('escapes a text child but not a rendered one', () => {
    assert.equal(String(h('div', null, 'a<b')), '<div>a&lt;b</div>');
    assert.equal(String(h('div', null, h('span', null, 'a'))), '<div><span>a</span></div>');
  });

  it('drops null, undefined and boolean children', () => {
    assert.equal(String(h('div', null, null, undefined, false, true, 'x')), '<div>x</div>');
  });

  it('renders a fragment as its children alone', () => {
    assert.equal(
      String(h(Fragment, null, h('i', null, 'a'), h('b', null, 'c'))),
      '<i>a</i><b>c</b>'
    );
  });

  it('calls a function tag with its children flattened', () => {
    /** @param {{ children?: unknown }} props */
    const Box = props => h('section', null, props.children);
    assert.equal(String(h(Box, null, ['a', ['b']])), '<section>ab</section>');
  });

  it('wraps output so a parent does not escape it — the 100 KB visible-source bug', () => {
    assert.ok(h('div', null) instanceof Html);
  });
});

describe('classToCss — the mapping the probe is auditable by', () => {
  it('resolves a fixed token', () => {
    assert.equal(classToCss('flex'), 'display:flex');
  });

  it('resolves an arbitrary value through its prefix', () => {
    assert.equal(classToCss('w-[50px]'), 'width:50px');
    assert.equal(classToCss('gap-y-[8px]'), 'row-gap:8px');
  });

  it('reads `text-` as colour or size by the shape of the value', () => {
    assert.equal(classToCss('text-[#fff]'), 'color:#fff');
    assert.equal(classToCss('text-[14px]'), 'font-size:14px');
  });

  it('strips the Tailwind escape out of a Figma variable reference', () => {
    assert.equal(classToCss(String.raw`p-[var(--size\/250,20px)]`), 'padding:var(--size/250,20px)');
  });

  it('turns an underscore back into the space Tailwind replaced', () => {
    assert.equal(classToCss('shadow-[0px_1px_2px_#000]'), 'box-shadow:0px 1px 2px #000');
  });

  it('handles the signed rotation special case', () => {
    assert.equal(classToCss('rotate-45'), 'rotate:45deg');
    assert.equal(classToCss('-rotate-90'), 'rotate:-90deg');
  });

  it('records a token it cannot express instead of dropping it — that is the finding', () => {
    const unknown = new Set();

    assert.equal(classToCss('supports-[display:grid]:grid-cols-7', unknown), '');
    assert.deepEqual([...unknown], ['supports-[display:grid]:grid-cols-7']);
  });

  it('records nothing for a token it resolved', () => {
    const unknown = new Set();

    classToCss('flex', unknown);
    classToCss('w-[50px]', unknown);
    assert.equal(unknown.size, 0);
  });

  it('covers every prefix it advertises', () => {
    for (const prefix of Object.keys(ARBITRARY))
      assert.notEqual(classToCss(`${prefix}-[1px]`), '', `${prefix} resolved to nothing`);
  });
});

describe('buildStylesheet — one rule per class, selector-escaped', () => {
  it('escapes the characters a CSS selector cannot carry raw', () => {
    assert.equal(buildStylesheet(['w-[50px]']), String.raw`.w-\[50px\]{width:50px}`);
    assert.equal(
      buildStylesheet(['-translate-x-1/2']),
      String.raw`.-translate-x-1\/2{translate:-50% 0}`
    );
  });

  it('omits a class that maps to nothing rather than emitting an empty rule', () => {
    assert.equal(buildStylesheet(['probe-codeconnect', 'flex']), '.flex{display:flex}');
  });

  it('collects the unmapped tokens into the caller’s sink', () => {
    const unknown = new Set();

    buildStylesheet(['flex', 'mystery-token'], unknown);
    assert.deepEqual([...unknown], ['mystery-token']);
  });
});

describe('parseBoxes — coordinates are relative to the parent, so the chain must be summed', () => {
  const boxes = parseBoxes(fixture('metadata-nested-offsets.txt'));

  it('places the root at its own canvas position', () => {
    assert.deepEqual(boxes.get('1:0'), {
      x: 100,
      y: 200,
      width: 800,
      height: 600,
      // `relative` is the tag's own x/y; the root's are its canvas position, with no parent to add.
      relative: { x: 100, y: 200 }
    });
  });

  it('adds the parent offset to a direct child', () => {
    assert.deepEqual(boxes.get('1:2'), {
      x: 110,
      y: 250,
      width: 780,
      height: 500,
      relative: { x: 10, y: 50 }
    });
  });

  it('sums two levels, which a flat scan got wrong by putting the sidebar at a negative x', () => {
    assert.deepEqual(boxes.get('1:3'), {
      x: 115,
      y: 255,
      width: 200,
      height: 100,
      relative: { x: 5, y: 5 }
    });
  });

  describe('a metadata file re-lists each instance as a root, expanding its children', () => {
    // The shape of `b-itsl-collab-add-element/figma-metadata.txt`: the frame tree closes, then every
    // instance appears again at x="0" y="0" with its `I…;…` children. Letting that second
    // declaration win put `PageHeader` at canvas (0, 0) — 3732 px left of its own frame.
    const expanded = parseBoxes(fixture('metadata-expanded-instances.txt'));

    it('keeps the first, in-tree declaration of a re-listed instance', () => {
      assert.deepEqual(expanded.get('1:2'), {
        x: 3780,
        y: 5316,
        width: 1184,
        height: 117,
        relative: { x: 48, y: 0 }
      });
    });

    it('resolves the expanded children against the in-tree position, not the re-listed (0, 0)', () => {
      assert.deepEqual(expanded.get('I1:2;9:1'), {
        x: 3780,
        y: 5336,
        width: 1184,
        height: 37,
        relative: { x: 0, y: 20 }
      });
    });
  });

  it('pops the stack at a closing tag, so a later sibling is not nested under the one before it', () => {
    assert.deepEqual(boxes.get('1:4'), {
      x: 100,
      y: 750,
      width: 800,
      height: 50,
      relative: { x: 0, y: 550 }
    });
  });

  it('finds every node in the fixture', () => {
    assert.deepEqual([...boxes.keys()], ['1:0', '1:1', '1:2', '1:3', '1:4']);
  });
});

describe('resolveFrame — the root is searched for, not assumed to be on line one', () => {
  it('finds a root behind a prose header (a9-sanna-login)', () => {
    const { frame, declared, line } = resolveFrame(fixture('metadata-prose-header.txt'));

    assert.equal(declared, true);
    assert.equal(line, 3);
    assert.equal(frame.id, '71:13345');
    assert.deepEqual([frame.width, frame.height], [1512, 982]);
  });

  it('finds a root behind an HTML comment header (a4-sesame-my-groups)', () => {
    const { frame, declared } = resolveFrame(fixture('metadata-comment-header.txt'));

    assert.equal(declared, true);
    assert.equal(frame.id, '2847:14994');
    assert.deepEqual([frame.width, frame.height], [1280, 1796]);
  });

  it('finds a root inside an escaped MCP envelope (a5-etsl-metadata-usage-widget)', () => {
    const { frame, declared } = resolveFrame(fixture('metadata-escaped-envelope.txt'));

    assert.equal(declared, true);
    assert.equal(frame.id, '17214:103584');
    assert.deepEqual([frame.width, frame.height], [1440, 2032]);
  });

  it('accepts a `symbol` root (b-sanna-account-creation)', () => {
    const { frame, declared } = resolveFrame(fixture('metadata-symbol-root.txt'));

    assert.equal(declared, true);
    assert.equal(frame.id, '174:232051');
    assert.deepEqual([frame.width, frame.height], [1512, 982]);
  });

  it('carries the root’s canvas origin so placement can subtract it', () => {
    const text = fixture('metadata-nested-offsets.txt'),
      { frame } = resolveFrame(text, parseBoxes(text));

    assert.deepEqual([frame.x, frame.y], [100, 200]);
  });

  it('NEGATIVE CONTROL: says it did not find one rather than inventing a number', () => {
    const { frame, declared, line } = resolveFrame(fixture('metadata-no-root.txt'));

    assert.equal(declared, false);
    assert.equal(line, null);
    assert.deepEqual(frame, { ...FABRICATED_FRAME });
  });
});

describe('placeRegion — the frame origin is subtracted, because the page is not the canvas', () => {
  const text = fixture('metadata-nested-offsets.txt'),
    boxes = parseBoxes(text),
    { frame } = resolveFrame(text, boxes);

  it('places a two-level-deep node at its offset within the frame', () => {
    // 1:3 is absolute (115, 255); the frame origin is (100, 200); so (15, 55).
    assert.equal(
      placeRegion({ nodeId: '1:3' }, 0, boxes, frame),
      'position:absolute;left:15px;top:55px;width:200px;height:100px;'
    );
  });

  it('marks a region with no box rather than placing it at the origin', () => {
    const style = placeRegion({ nodeId: '9:9' }, 4, boxes, frame);

    assert.match(style, /^position:relative;/);
    assert.match(style, /region 4 has no box in the metadata/);
  });

  it('marks a region with no node id at all', () => {
    assert.match(placeRegion({}, 0, boxes, frame), /has no box in the metadata/);
  });

  it('falls back to a zero origin when the frame carries none', () => {
    assert.equal(
      placeRegion({ nodeId: '1:3' }, 0, boxes, {}),
      'position:absolute;left:115px;top:255px;width:200px;height:100px;'
    );
  });
});

describe('the capture index is validated at the read boundary', () => {
  it('accepts a well-formed index', () => {
    const parsed = CaptureIndex.parse({
      captures: [{ file: 'a.tsx', call: 'get_design_context', part: 'code' }]
    });

    assert.equal(parsed.captures.length, 1);
  });

  it('NEGATIVE CONTROL: rejects an entry with no `file`, which the old reader skipped in silence', () => {
    const malformed = JSON.parse(fixture('index-malformed.json'));

    assert.throws(() => CaptureIndex.parse(malformed), /file/);
  });

  it('rejects a `captures` that is not an array', () => {
    assert.throws(() => CaptureIndex.parse({ captures: {} }));
  });

  it('reports a malformed index rather than scoring a smaller number', () => {
    const dir = makeRun({
      metadata: fixture('metadata-nested-offsets.txt'),
      index: fixture('index-malformed.json')
    });

    assert.throws(() => readRegions(dir, 'captures'));
  });
});

describe('readRegions — two input shapes, one reader', () => {
  it('reads the normalised index and carries the label and node id through', () => {
    const dir = makeRun({ metadata: fixture('metadata-nested-offsets.txt') }),
      [region] = readRegions(dir, 'captures');

    assert.equal(region.label, 'card');
    assert.equal(region.nodeId, '1:3');
    assert.equal(region.file, 'captures/01-get_design_context.tsx');
    assert.match(region.source, /data-node-id="1:3"/);
  });

  it('falls back to the file path when the capture carries no label', () => {
    const dir = makeRun({
        metadata: fixture('metadata-nested-offsets.txt'),
        index: JSON.stringify({
          captures: [
            { file: 'captures/01-get_design_context.tsx', call: 'get_design_context', part: 'code' }
          ]
        })
      }),
      [region] = readRegions(dir, 'captures');

    assert.equal(region.label, 'captures/01-get_design_context.tsx');
    assert.equal(region.nodeId, undefined);
  });

  it('reads the original markdown when the run has no index at all', () => {
    const dir = makeRun({ metadata: fixture('metadata-nested-offsets.txt') });

    writeFileSync(
      join(dir, 'figma-design-context.md'),
      '# Login, node 71:13345\n\n```tsx\nexport default () => <div className="flex" />;\n```\n'
    );

    const [region] = readRegions(dir, 'no-such-index-dir');

    assert.equal(region.label, 'Login, node 71:13345');
    assert.equal(region.nodeId, '71:13345');
    assert.equal(region.file, 'figma-design-context.md');
  });

  it('numbers the blocks when one file holds several', () => {
    const dir = makeRun({ metadata: fixture('metadata-nested-offsets.txt') });

    writeFileSync(
      join(dir, 'figma-design-context.md'),
      '# two\n\n```tsx\nexport default () => <i />;\n```\n\n```tsx\nexport default () => <b />;\n```\n'
    );

    assert.deepEqual(
      readRegions(dir, 'no-such-index-dir').map(r => r.file),
      ['figma-design-context.md#1', 'figma-design-context.md#2']
    );
  });
});

describe('buildReport — the numbers the ingestion plan is judged by', () => {
  const boxes = parseBoxes(fixture('metadata-nested-offsets.txt')),
    rendered = [
      {
        file: 'a.tsx',
        label: 'placed',
        nodeId: '1:3',
        source: '',
        html: '<i class="flex"></i>',
        undefinedComponents: ['Mask']
      },
      {
        file: 'b.tsx',
        label: 'unplaced',
        nodeId: '9:9',
        source: '',
        html: '<b></b>',
        undefinedComponents: []
      },
      { file: 'c.tsx', label: 'failed', source: '', error: 'Unterminated regular expression' }
    ],
    report = buildReport({
      run: 'runs/x',
      out: 'runs/x/out.html',
      document: '<div data-node-id="1:3"></div><div data-node-id=""></div>',
      frame: { width: 800, height: 600 },
      frameDeclared: true,
      rendered,
      boxes,
      classes: new Set(['flex', 'mystery']),
      unknown: new Set(['mystery'])
    });

  it('counts a region as placed only when its node id has a box', () => {
    assert.deepEqual(
      report.regions.map(r => r.placed),
      [true, false, false]
    );
  });

  it('reports the byte count of each region, and zero for one that failed', () => {
    assert.deepEqual(
      report.regions.map(r => r.bytes),
      ['<i class="flex"></i>'.length, '<b></b>'.length, 0]
    );
  });

  it('keeps the parse error on the region it belongs to', () => {
    assert.equal(report.regions[2].error, 'Unterminated regular expression');
    assert.equal(report.regions[0].error, undefined);
  });

  it('counts the node ids that actually reached the page, not the ones captured', () => {
    assert.equal(report.nodeIdsInOutput, 2);
  });

  it('carries the frame and whether it was declared', () => {
    assert.equal(report.frameDeclared, true);
    assert.deepEqual(report.frame, { width: 800, height: 600 });
  });

  it('sorts the unmapped classes and the undefined components, so two runs can be diffed', () => {
    assert.deepEqual(report.classesUnmapped, ['mystery']);
    assert.deepEqual(report.undefinedComponents, ['Mask']);
    assert.equal(report.classesSeen, 2);
  });
});

describe('codeCaptures — filter on `part`, so advisory prose never reaches a parser', () => {
  const index = {
    captures: [
      { file: 'a.tsx', call: 'get_design_context', part: 'code' },
      { file: 'b.md', call: 'get_design_context', part: 'advisory:styles' },
      { file: 'c.txt', call: 'get_metadata', part: 'code' },
      { file: 'd.tsx', call: 'get_design_context' }
    ]
  };

  it('keeps the code parts of a design-context response', () => {
    assert.deepEqual(
      codeCaptures(index).map(c => c.file),
      ['a.tsx', 'd.tsx']
    );
  });

  it('treats a missing `part` as code, so pre-split indexes still read', () => {
    assert.ok(codeCaptures(index).some(c => c.file === 'd.tsx'));
  });

  it('drops an advisory block even though its `call` is truthful', () => {
    assert.ok(!codeCaptures(index).some(c => c.file === 'b.md'));
  });
});

describe('blocksFromMarkdown — four shapes arrived, and a naive read emptied six runs', () => {
  it('takes every fenced block', () => {
    const text = '# h\n\n```tsx\nA\n```\n\ntext\n\n```jsx\nB\n```\n';

    assert.deepEqual(blocksFromMarkdown(text), ['A\n', 'B\n']);
  });

  it('falls back to unfenced JSX when there is no fence', () => {
    const text = 'preamble\n\nexport default () => <div className="x" />;\n';

    assert.deepEqual(blocksFromMarkdown(text), ['export default () => <div className="x" />;\n']);
  });

  it('returns nothing for prose that merely mentions the design', () => {
    assert.deepEqual(blocksFromMarkdown('The agent summarised the tree instead.\n'), []);
  });

  it('prefers the fence when both are present, rather than returning the file twice', () => {
    const text = 'const x = 1; className="y"\n\n```tsx\nREAL\n```\n';

    assert.deepEqual(blocksFromMarkdown(text), ['REAL\n']);
  });
});

describe('undefinedComponentsIn — one undefined name used to take the whole region', () => {
  it('names a referenced component the block does not define', () => {
    const source = 'function Card() { return <Mask />; }\nexport default () => <Card />;';

    assert.deepEqual(undefinedComponentsIn(source), ['Mask']);
  });

  it('never stubs Fragment or the Code Connect placeholder', () => {
    const source = '<Fragment><CodeConnectSnippet /></Fragment>';

    assert.deepEqual(undefinedComponentsIn(source), []);
  });

  it('ignores hyphenated elements, which compile to intrinsic strings', () => {
    assert.deepEqual(undefinedComponentsIn('<sl-grid></sl-grid>'), []);
  });

  it('emits a stub that renders a visible placeholder, not nothing', () => {
    const stub = stubSource(['Mask']);

    assert.match(stub, /data-undefined-component/);
    assert.match(stub, /probe-undefined/);
    assert.match(stub, /"Mask"/);
  });

  it('emits nothing when there is nothing to stub', () => {
    assert.equal(stubSource([]), '');
  });
});

describe('renderRegion — a failing region is recorded, never thrown', () => {
  it('renders a self-contained block', async () => {
    const out = await renderRegion({
      file: 'a.tsx',
      label: 'a',
      source: 'export default () => <div data-node-id="1:1" className="flex">hi</div>;'
    });

    assert.equal(out.error, undefined);
    assert.equal(out.html, '<div data-node-id="1:1" class="flex">hi</div>');
  });

  it('stubs an undefined component instead of losing the region around it', async () => {
    const out = await renderRegion({
      file: 'a.tsx',
      label: 'a',
      source: 'export default () => <div><Mask /><span>kept</span></div>;'
    });

    assert.equal(out.error, undefined);
    assert.match(String(out.html), /data-undefined-component="Mask"/);
    assert.match(String(out.html), /<span>kept<\/span>/);
    assert.deepEqual(out.undefinedComponents, ['Mask']);
  });

  it('keeps the parse error on the region, so the run still reports', async () => {
    const out = await renderRegion({
      file: 'a.tsx',
      label: 'a',
      source: 'export default () => <div'
    });

    assert.ok(out.error);
    assert.equal(out.html, undefined);
  });

  it('renders every region even when one of them fails', async () => {
    const out = await renderRegions([
      { file: 'a.tsx', label: 'a', source: 'export default () => <i>a</i>;' },
      { file: 'b.tsx', label: 'b', source: 'export default () => <i' },
      { file: 'c.tsx', label: 'c', source: 'export default () => <i>c</i>;' }
    ]);

    assert.deepEqual(
      out.map(r => r.error === undefined),
      [true, false, true]
    );
  });

  it('renders a Code Connect substitution as a visible hole, carrying its node id', () => {
    const markup = String(CodeConnectSnippet({ name: 'sl-grid', 'data-node-id': '1:2' }));

    assert.match(markup, /data-code-connect="sl-grid"/);
    assert.match(markup, /data-node-id="1:2"/);
    assert.match(markup, /class="probe-codeconnect"/);
    assert.match(markup, />sl-grid</);
  });

  it('names itself when the substitution carries no name at all', () => {
    assert.match(String(CodeConnectSnippet()), /data-code-connect="snippet"/);
  });
});

describe('classesIn and buildBody — what reaches the stylesheet and the page', () => {
  it('collects every class across every region', () => {
    const classes = classesIn([
      { html: '<div class="flex gap-[8px]"></div>' },
      { html: '<i class="flex italic"></i>' }
    ]);

    assert.deepEqual([...classes].sort(), ['flex', 'gap-[8px]', 'italic']);
  });

  it('ignores a region that failed, rather than throwing on its missing html', () => {
    assert.deepEqual([...classesIn([{}])], []);
  });

  it('puts the error on the page where the markup would have been', () => {
    const body = buildBody([{ label: 'a<b', error: 'x > y' }], new Map(), {});

    assert.match(body, /data-region="a&lt;b"/);
    assert.match(body, /<pre class="probe-error">x &gt; y<\/pre>/);
  });

  it('writes an empty node-id attribute rather than the word undefined', () => {
    assert.match(buildBody([{ label: 'a', html: '' }], new Map(), {}), /data-node-id=""/);
  });
});

describe('buildDocument — the page shell', () => {
  it('sizes the page from the frame', () => {
    const doc = buildDocument({
      run: 'runs/x',
      frame: { width: 1512, height: 982 },
      body: '<div></div>',
      stylesheet: '.flex{display:flex}'
    });

    assert.match(doc, /body\{width:1512px;height:982px;/);
    assert.match(doc, /\.flex\{display:flex\}/);
    assert.match(doc, /^<!doctype html>/);
  });

  it('escapes the run name into the title', () => {
    assert.match(
      buildDocument({ run: 'a<b', frame: { width: 1, height: 1 }, body: '', stylesheet: '' }),
      /<title>Design reconstruction — a&lt;b<\/title>/
    );
  });
});

describe('NEGATIVE CONTROL: the probe refuses to score geometry it invented', () => {
  const cli = join(HERE, 'render-design.mjs');

  it('goes red on a run whose metadata declares no root box', async () => {
    const dir = makeRun({ metadata: fixture('metadata-no-root.txt') });

    await assert.rejects(
      () => run(process.execPath, [cli, '--run', dir, '--out', join(dir, 'out.html')]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 3);
        assert.match(error.stderr, /no root frame declared/);
        assert.match(error.stderr, /fabricated 1440×1024/);
        return true;
      }
    );
  });

  it('goes green on the same run once the metadata declares one', async () => {
    const dir = makeRun({ metadata: fixture('metadata-nested-offsets.txt') }),
      { stdout } = await run(process.execPath, [cli, '--run', dir, '--out', join(dir, 'out.html')]);

    const report = JSON.parse(stdout);

    assert.equal(report.frameDeclared, true);
    assert.deepEqual([report.frame.width, report.frame.height], [800, 600]);
    assert.equal(report.regions[0].placed, true);
  });

  it('measures anyway when the operator says so, and still says the frame was invented', async () => {
    const dir = makeRun({ metadata: fixture('metadata-no-root.txt') }),
      { stdout } = await run(process.execPath, [
        cli,
        '--run',
        dir,
        '--out',
        join(dir, 'out.html'),
        '--allow-fabricated-frame'
      ]);

    assert.equal(JSON.parse(stdout).frameDeclared, false);
  });

  it('writes no file at all when it refuses', async () => {
    const dir = makeRun({ metadata: fixture('metadata-no-root.txt') });

    await assert.rejects(() =>
      run(process.execPath, [cli, '--run', dir, '--out', join(dir, 'out.html')])
    );
    assert.throws(() => readFileSync(join(dir, 'out.html')));
  });

  it('exits 1, naming the run, when no design-context block was captured', async () => {
    const dir = makeRun({
      metadata: fixture('metadata-nested-offsets.txt'),
      index: JSON.stringify({ captures: [] })
    });

    await assert.rejects(
      () => run(process.execPath, [cli, '--run', dir]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, /no fenced design-context blocks found/);
        return true;
      }
    );
  });

  it('exits 2 on a run directory that is not there', async () => {
    await assert.rejects(
      () => run(process.execPath, [cli, '--run', join(tmpdir(), 'no-such-run-dir')]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 2);
        assert.match(error.stderr, /usage:/);
        return true;
      }
    );
  });
});

describe('FIXED is a mapping, not a bag of strings', () => {
  it('declares a CSS declaration for every token but the probe’s own class', () => {
    for (const [token, css] of Object.entries(FIXED))
      if (token !== 'probe-codeconnect') assert.match(css, /^[a-z-]+:/, `${token} → ${css}`);
  });
});
