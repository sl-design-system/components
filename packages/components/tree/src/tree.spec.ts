import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { type Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import '../register.js';
import { FlatTreeDataSource } from './flat-tree-data-source.js';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type Tree } from './tree.js';

interface FlatDataNode {
  id: number;
  expandable: boolean;
  level: number;
  name: string;
}

interface NestedDataNode {
  id: number;
  name: string;
  children?: NestedDataNode[];
}

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

const flatData: FlatDataNode[] = [
  {
    id: 0,
    expandable: true,
    level: 0,
    name: 'Actions'
  },
  {
    id: 1,
    expandable: false,
    level: 1,
    name: 'Button'
  },
  {
    id: 2,
    expandable: true,
    level: 0,
    name: 'Navigation'
  },
  {
    id: 3,
    expandable: true,
    level: 1,
    name: 'Tree'
  },
  {
    id: 4,
    expandable: false,
    level: 2,
    name: 'Flat Data Source'
  },
  {
    id: 5,
    expandable: false,
    level: 2,
    name: 'Nested Data Source'
  }
];

const nestedData: NestedDataNode[] = [
  {
    id: 0,
    name: 'Actions',
    children: [{ id: 1, name: 'Button' }]
  },
  {
    id: 2,
    name: 'Navigation',
    children: [
      {
        id: 3,
        name: 'Tree',
        children: [
          { id: 4, name: 'Flat Data Source' },
          { id: 5, name: 'Nested Data Source' }
        ]
      }
    ]
  }
];

describe('sl-tree', () => {
  let el: Tree;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tree></sl-tree>`);
    });

    it('should have a tree role', () => {
      expect(el).to.have.attribute('role', 'tree');
    });

    it('should not hide the indentation guides', () => {
      expect(el).to.not.have.attribute('hide-guides');
      expect(el.hideGuides).not.to.be.true;
    });

    it('should not have a data source', () => {
      expect(el.dataSource).to.be.undefined;
    });

    it('should not have any tree nodes', () => {
      const nodes = el.renderRoot.querySelectorAll('sl-tree-node');

      expect(nodes).to.have.lengthOf(0);
    });
  });

  describe('with flat data', () => {
    let ds: FlatTreeDataSource;

    beforeEach(async () => {
      ds = new FlatTreeDataSource(flatData, {
        getIcon: ({ expandable }, expanded) => (!expandable ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
        getId: item => item.id,
        getLabel: ({ name }) => name,
        getLevel: ({ level }) => level,
        isExpandable: ({ expandable }) => expandable,
        isExpanded: ({ name }) => ['Navigation', 'Tree'].includes(name)
      });

      el = await fixture(html`<sl-tree .dataSource=${ds}></sl-tree>`);
      await el.layoutComplete;
    });

    it('should render the visible tree nodes', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')),
        names = nodes.map(node => node.textContent?.trim());

      expect(nodes).to.have.lengthOf(5);
      expect(names).to.deep.equal(['Actions', 'Navigation', 'Tree', 'Flat Data Source', 'Nested Data Source']);
    });

    it('should render the tree nodes with the correct icons', () => {
      const icons = Array.from(el.renderRoot.querySelectorAll<Icon>('sl-tree-node sl-icon')).map(icon => icon.name);

      expect(icons).to.deep.equal(['far-folder', 'far-folder-open', 'far-folder-open', 'far-file', 'far-file']);
    });

    it('should render the tree nodes with indentation guides', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')),
        guides = nodes.map(node => node.renderRoot.querySelector('sl-indent-guides')!);

      expect(guides).to.have.lengthOf(5);
      expect(guides.map(g => g.level)).to.deep.equal([0, 0, 1, 2, 2]);
    });
  });

  describe('nested data', () => {
    let ds: NestedTreeDataSource;

    beforeEach(async () => {
      ds = new NestedTreeDataSource(nestedData, {
        getChildren: ({ children }) => children,
        getIcon: ({ children }, expanded) => (!children ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
        getId: item => item.id,
        getLabel: ({ name }) => name,
        isExpandable: ({ children }) => !!children,
        isExpanded: ({ name }) => ['Navigation', 'Tree'].includes(name)
      });

      el = await fixture(html`<sl-tree .dataSource=${ds}></sl-tree>`);
      await el.layoutComplete;
    });

    it('should render the visible tree nodes', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')),
        names = nodes.map(node => node.textContent?.trim());

      expect(nodes).to.have.lengthOf(5);
      expect(names).to.deep.equal(['Actions', 'Navigation', 'Tree', 'Flat Data Source', 'Nested Data Source']);
    });

    it('should render the tree nodes with the correct icons', () => {
      const icons = Array.from(el.renderRoot.querySelectorAll<Icon>('sl-tree-node sl-icon')).map(icon => icon.name);

      expect(icons).to.deep.equal(['far-folder', 'far-folder-open', 'far-folder-open', 'far-file', 'far-file']);
    });

    it('should render the tree nodes with indentation guides', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')),
        guides = nodes.map(node => node.renderRoot.querySelector('sl-indent-guides')!);

      expect(guides).to.have.lengthOf(5);
      expect(guides.map(g => g.level)).to.deep.equal([0, 0, 1, 2, 2]);
    });
  });
});
