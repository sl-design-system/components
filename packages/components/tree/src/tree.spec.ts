import { type Icon } from '@sl-design-system/icon';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { FlatTreeDataSource } from './flat-tree-data-source.js';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type Tree } from './tree.js';

declare global {
  interface ARIAMixin {
    // Explicitly declare this since older versions of
    // TypeScript's lib.dom.d.ts don't have it yet.
    ariaControlsElements: readonly Element[] | null;
  }
}

interface FlatDataNode {
  id: number;
  expandable: boolean;
  level: number;
  name: string;
}

interface NestedDataNode {
  id: number;
  name: string;
  description?: string;
  children?: NestedDataNode[];
}

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
    description: 'Actions description',
    children: [{ id: 1, name: 'Button', description: 'Button description' }]
  },
  {
    id: 2,
    name: 'Navigation',
    description: 'Navigation description',
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

    it('should have a treegrid role', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper).to.have.attribute('role', 'treegrid');
    });

    it('should not hide the indentation guides', () => {
      expect(el).to.not.have.attribute('hide-guides');
      expect(el.hideGuides).not.to.be.true;
    });

    it('should not have a data source', () => {
      expect(el.dataSource).to.be.undefined;
    });

    it('should proxy the aria-label attribute to the wrapper element', async () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-label');
      expect(wrapper).to.have.attribute('aria-label', 'Label');
    });

    it('should proxy the aria-labelledby attribute to the wrapper element', async () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      el.setAttribute('aria-labelledby', 'id');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-labelledby');
      expect(wrapper).to.have.attribute('aria-labelledby', 'id');
    });

    it('should not have any tree nodes', () => {
      const nodes = el.renderRoot.querySelectorAll('sl-tree-node');

      expect(nodes).to.have.lengthOf(0);
    });
  });

  describe('accessibility', () => {
    let ds: NestedTreeDataSource;

    beforeEach(async () => {
      ds = new NestedTreeDataSource(nestedData, {
        getAriaDescription: ({ description }) => description ?? undefined,
        getChildren: ({ children }) => children,
        getId: item => item.id,
        getLabel: ({ name }) => name,
        isExpandable: ({ children }) => !!children,
        isExpanded: () => true
      });

      el = await fixture(html`<sl-tree .dataSource=${ds}></sl-tree>`);
    });

    it('should have an aria-label for each node', () => {
      const labels = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaLabel);

      expect(labels).to.deep.equal([
        'Actions',
        'Button',
        'Navigation',
        'Tree',
        'Flat Data Source',
        'Nested Data Source'
      ]);
    });

    it('should have an aria-description for each node if provided', () => {
      const descriptions = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaDescription);

      expect(descriptions).to.deep.equal([
        'Actions description',
        'Button description',
        'Navigation description',
        null,
        null,
        null
      ]);
    });

    it('should have an aria-level for each node', () => {
      const levels = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaLevel);

      expect(levels).to.deep.equal(['1', '2', '1', '2', '3', '3']);
    });

    it('should have an aria-rowindex for each node', () => {
      const rowIndices = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaRowIndex);

      expect(rowIndices).to.deep.equal(['1', '2', '3', '4', '5', '6']);
    });

    it('should have an aria-posinset for each node', () => {
      const posInSet = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaPosInSet);

      expect(posInSet).to.deep.equal(['1', '1', '2', '1', '1', '2']);
    });

    it('should have an aria-setsize for each node', () => {
      const setSize = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')).map(node => node.ariaSetSize);

      expect(setSize).to.deep.equal(['2', '1', '2', '1', '2', '2']);
    });

    it('should have an aria-controls for each node with children', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node')),
        controls = nodes.map(node => node.ariaControlsElements);

      expect(controls).to.have.length(6);
      expect(controls[0]).to.deep.equal([nodes[1]]);
      expect(controls[1]).to.be.null;
      expect(controls[2]).to.deep.equal([nodes[3]]);
      expect(controls[3]).to.deep.equal([nodes[4], nodes[5]]);
      expect(controls[4]).to.be.null;
      expect(controls[5]).to.be.null;
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
    });

    it('should have a tabindex of 0 for the first node', () => {
      const firstNode = el.renderRoot.querySelector('sl-tree-node');

      expect(firstNode).to.have.attribute('tabindex', '0');
    });

    it('should have a tabindex of -1 for all other nodes', () => {
      const tabIndices = Array.from(
        el.renderRoot.querySelectorAll<HTMLElement>('sl-tree-node:not(:first-of-type)')
      ).map(node => node.tabIndex);

      expect(tabIndices).to.deep.equal([-1, -1, -1, -1]);
    });

    it('should focus the first tree node when focusing the tree', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
    });

    it('should focus the next/previous tree nodes when pressing the up/down arrow keys', async () => {
      el.focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Navigation');

      await userEvent.keyboard('{ArrowDown}');
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(3)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Tree');

      await userEvent.keyboard('{ArrowUp}');
      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Navigation');
    });

    it('should expand and collapse tree nodes when pressing the right/left arrow keys', async () => {
      el.focus();

      // Expand first node
      await userEvent.keyboard('{ArrowRight}');

      // Wait for the tree nodes to update
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');
      expect(el.shadowRoot?.activeElement).to.have.property('expanded', true);

      // Move focus to the next node
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(2)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Button');

      // Move focus to the previous (first) node
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');

      // Collapse first node
      await userEvent.keyboard('{ArrowLeft}');

      // Wait for the tree nodes to update
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(1)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Actions');
      expect(el.shadowRoot?.activeElement).to.have.property('expanded', false);
    });

    it('should focus the parent node when pressing the left arrow on a leaf node', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(5)')?.focus();

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Nested Data Source');

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(3)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Tree');
    });

    it('should do nothing when pressing the right arrow on a leaf node', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(4)')?.focus();

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Flat Data Source');

      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.match('sl-tree-node:nth-of-type(4)');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('Flat Data Source');
    });

    it('should expand all siblings that are at the same level when pressing *', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-tree-node:nth-of-type(2)')?.focus();

      await userEvent.keyboard('*');

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

    it('should render the tree nodes with proper ARIA attributes', () => {
      const nodes = Array.from(el.renderRoot.querySelectorAll('sl-tree-node'));

      expect(nodes.map(g => g.ariaLabel)).to.deep.equal([
        'Actions',
        'Navigation',
        'Tree',
        'Flat Data Source',
        'Nested Data Source'
      ]);
      expect(nodes.map(g => g.ariaLevel)).to.deep.equal(['1', '1', '2', '3', '3']);
      expect(nodes.map(g => g.ariaPosInSet)).to.deep.equal(['1', '2', '1', '1', '2']);
      expect(nodes.map(g => g.ariaRowIndex)).to.deep.equal(['1', '2', '3', '4', '5']);
      expect(nodes.map(g => g.ariaSetSize)).to.deep.equal(['2', '2', '1', '2', '2']);
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
