import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { type Icon } from '@sl-design-system/icon';
import { sendKeys } from '@web/test-runner-commands';
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

  describe('keyboard navigation', () => {
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

    it('should focus the first tree node when focusing the tree', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
    });

    it('should focus the next/previous tree nodes when pressing the up/down arrow keys', async () => {
      el.focus();

      await sendKeys({ press: 'ArrowDown' });
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Navigation');

      await sendKeys({ press: 'ArrowDown' });
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(3)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Tree');

      await sendKeys({ press: 'ArrowUp' });
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Navigation');
    });

    it('should expand and collapse tree nodes when pressing the right/left arrow keys', async () => {
      el.focus();

      // Expand first node
      await sendKeys({ press: 'ArrowRight' });

      // Wait for the tree nodes to update
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');
      expect(el.shadowRoot?.activeElement).to.have.property('expanded', true);

      // Move focus to the next node
      await sendKeys({ press: 'ArrowRight' });

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Button');

      // Move focus to the previous (first) node
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');

      // Collapse first node
      await sendKeys({ press: 'ArrowLeft' });

      // Wait for the tree nodes to update
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');
      expect(el.shadowRoot?.activeElement).to.have.property('expanded', false);
    });

    it('should focus the parent node when pressing the left arrow on a leaf node', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(5)')?.focus();

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Nested Data Source');

      await sendKeys({ press: 'ArrowLeft' });

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(3)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Tree');
    });

    it('should do nothing when pressing the right arrow on a leaf node', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(4)')?.focus();

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Flat Data Source');

      await sendKeys({ press: 'ArrowRight' });

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(4)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Flat Data Source');
    });

    it('should expand all siblings that are at the same level when pressing *', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(2)')?.focus();

      await sendKeys({ press: '*' });

      // Wait for the tree nodes to update
      await new Promise(resolve => setTimeout(resolve, 50));

      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node'));

      expect(nodes).to.have.lengthOf(6);
      expect(nodes.every(n => !n.expandable || n.expanded)).to.be.true;
    });
  });

  describe('using flat data', () => {
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

  describe('using nested data', () => {
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
