/**
 * The replay tree, held against the live tool it stands in for.
 *
 * The oracle is `runs/2026-10-01-a8-nsp-group-list/captures/metadata/334-20573.txt` — what
 * `get_metadata` really returned for that frame — and the rule is that the replay may see more of
 * the design but never less.
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { metadataOf, metadataXml, tagFor } from './rest-metadata.mjs';
import { parseMetadata } from './traverse.mjs';

/** @param {string} path */
const read = path => readFileSync(path, 'utf8');

const capture = JSON.parse(read('runs/captures/a8-nsp-group-list/rest/nodes-334-20573.json')).nodes,
  live = read('runs/2026-10-01-a8-nsp-group-list/captures/metadata/334-20573.txt');

/** @param {string} xml */
const idsIn = xml => new Set([...xml.matchAll(/\bid="([^"]*)"/g)].map(([, id]) => id));

describe('the replay tree against the tool it replaces', () => {
  it('holds every id the live tool returned', () => {
    const mine = idsIn(metadataOf(capture, '334:20573')),
      theirs = idsIn(live);

    assert.equal(theirs.size, 98);
    for (const id of theirs) assert.ok(mine.has(id), `the replay is missing ${id}`);
  });

  it('sees more of the design, never less', () => {
    const mine = idsIn(metadataOf(capture, '334:20573'));

    // The eighteen extra are inside `334:20594`, the detached frame MCP stopped short of.
    assert.equal(mine.size, 116);
  });

  it('parses as metadata, because that is the only thing it is for', () => {
    const root = parseMetadata(metadataOf(capture, '334:20573'));

    assert.equal(root.id, '334:20573');
    assert.equal(root.tag, 'frame');
    assert.equal(root.name, 'Group list');
  });

  it('stops at an instance boundary, which is what makes pruning worth anything', () => {
    const root = parseMetadata(metadataOf(capture, '334:20573'));

    /**
     * @param {import('./traverse.mjs').FigmaNode} node
     * @returns {import('./traverse.mjs').FigmaNode[]}
     */
    const flat = node => [node, ...node.children.flatMap(flat)];

    const instances = flat(root).filter(node => node.tag === 'instance');

    assert.ok(instances.length > 0);
    for (const one of instances) assert.deepEqual(one.children, []);
  });

  it('expands that same instance when it is asked for by name', () => {
    const avatar = parseMetadata(metadataOf(capture, '334:20593'));

    assert.equal(avatar.tag, 'instance');
    assert.ok(avatar.children.length > 0, 'the boundary applied to the node that was asked for');
  });

  it('maps the types whose tag is not just a lowercased name', () => {
    assert.equal(tagFor('COMPONENT_SET'), 'component-set');
    assert.equal(tagFor('REGULAR_POLYGON'), 'polygon');
    assert.equal(tagFor('FRAME'), 'frame');
    assert.equal(tagFor('TEXT'), 'text');
  });

  it('marks a hidden node hidden, reading an omitted `visible` as visible', () => {
    const shown = metadataXml({ id: '1:1', type: 'FRAME', name: 'a' }),
      hidden = metadataXml({ id: '1:2', type: 'FRAME', name: 'b', visible: false });

    assert.ok(!shown.includes('hidden'));
    assert.ok(hidden.includes('hidden="true"'));
  });

  it('escapes a name that would otherwise close the tag, and the tree survives it', () => {
    // A design layer really can be called `"Dziś" <b>`. Unescaped, the quote ends the attribute
    // and the `<` opens a tag, and the walk gets a tree that is not the design.
    //
    // The name arrives **escaped**, because `parseMetadata` does not decode entities. That is a
    // difference from the live tool and it is left standing rather than papered over here: what
    // the live tool does with such a name is not known, and inventing a decoder to match a
    // behaviour nobody has observed is how the last four defects got written.
    const xml = metadataXml({ id: '1:1', type: 'FRAME', name: 'a "quoted" <name> & more' }),
      node = parseMetadata(xml);

    assert.equal(node.id, '1:1');
    assert.equal(node.tag, 'frame');
    assert.equal(node.name, 'a &quot;quoted&quot; &lt;name&gt; &amp; more');
  });

  it('keeps a child whose parent has such a name, which is the thing that would break', () => {
    const xml = metadataXml({
        id: '1:1',
        type: 'FRAME',
        name: 'a "quoted" <name>',
        children: [{ id: '1:2', type: 'TEXT', name: 'label' }]
      }),
      node = parseMetadata(xml);

    assert.equal(node.children.length, 1);
    assert.equal(node.children[0].id, '1:2');
  });

  describe('NEGATIVE CONTROL: a node that is not there is not a leaf', () => {
    it('throws rather than returning an empty frame', () => {
      assert.throws(() => metadataOf(capture, '9999:9999'), /No node could be found/);
    });

    it('and the live tool says the same thing, which is what parseMetadata refuses', () => {
      assert.throws(
        () => parseMetadata('No node could be found for the provided nodeId: 9999:9999'),
        /carries no element/
      );
    });
  });
});
