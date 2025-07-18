import { faFileLines, faFolder, faFolderOpen, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Badge } from '@sl-design-system/badge';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/menu/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import '../register.js';
import { FlatTreeDataSource } from './flat-tree-data-source.js';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'dataSource' | 'hideGuides' | 'renderer' | 'scopedElements'> & {
  styles?: string;
};
type Story = StoryObj<Props>;

export interface FlatDataNode {
  id: number;
  expandable: boolean;
  level: number;
  name: string;
}

export interface NestedDataNode {
  id: number;
  name: string;
  children?: NestedDataNode[];
}

export interface LazyNestedDataNode {
  id: string;
  expandable?: boolean;
  children?: LazyNestedDataNode[] | Promise<LazyNestedDataNode[]> | Array<Promise<LazyNestedDataNode>>;
}

Icon.register(faFileLines, faFolder, faFolderOpen, faPen, faTrash);

export const flatData: FlatDataNode[] = [
  {
    id: 0,
    expandable: true,
    level: 0,
    name: 'textarea'
  },
  {
    id: 1,
    expandable: false,
    level: 1,
    name: 'package.json'
  },
  {
    id: 2,
    expandable: true,
    level: 0,
    name: 'tooltip'
  },
  {
    id: 3,
    expandable: false,
    level: 1,
    name: 'package.json'
  },
  {
    id: 4,
    expandable: true,
    level: 0,
    name: 'tree'
  },
  {
    id: 5,
    expandable: true,
    level: 1,
    name: 'src'
  },
  {
    id: 6,
    expandable: false,
    level: 2,
    name: 'flat-tree-model.ts'
  },
  {
    id: 7,
    expandable: false,
    level: 2,
    name: 'nested-tree-model.ts'
  },
  {
    id: 8,
    expandable: false,
    level: 2,
    name: 'tree-model.ts'
  },
  {
    id: 9,
    expandable: false,
    level: 2,
    name: 'tree-node.scss'
  },
  {
    id: 10,
    expandable: false,
    level: 2,
    name: 'tree-node.ts'
  },
  {
    id: 11,
    expandable: false,
    level: 2,
    name: 'tree.ts'
  },
  {
    id: 12,
    expandable: false,
    level: 2,
    name: 'utils.ts'
  },
  {
    id: 13,
    expandable: false,
    level: 1,
    name: 'index.ts'
  },
  {
    id: 14,
    expandable: false,
    level: 1,
    name: 'package.json'
  },
  {
    id: 15,
    expandable: false,
    level: 1,
    name: 'register.ts'
  },
  {
    id: 16,
    expandable: false,
    level: 0,
    name: 'eslint.config.mjs'
  },
  {
    id: 17,
    expandable: false,
    level: 0,
    name: 'stylelint.config.mjs'
  }
];

export const nestedData: NestedDataNode[] = [
  {
    id: 0,
    name: 'textarea',
    children: [{ id: 1, name: 'package.json' }]
  },
  {
    id: 2,
    name: 'tooltip',
    children: [{ id: 3, name: 'package.json' }]
  },
  {
    id: 4,
    name: 'tree',
    children: [
      {
        id: 5,
        name: 'src',
        children: [
          { id: 6, name: 'flat-tree-model.ts' },
          { id: 7, name: 'nested-tree-model.ts' },
          { id: 8, name: 'tree-model.ts' },
          { id: 9, name: 'tree-node.scss' },
          { id: 10, name: 'tree-node.ts' },
          { id: 11, name: 'tree.ts' },
          { id: 12, name: 'utils.ts' }
        ]
      },
      { id: 13, name: 'index.ts' },
      { id: 14, name: 'package.json' },
      { id: 15, name: 'register.ts' }
    ]
  },
  { id: 16, name: 'eslint.config.mjs' },
  { id: 17, name: 'stylelint.config.mjs' }
];

export default {
  title: 'Navigation/Tree',
  tags: ['draft'],
  excludeStories: ['flatData', 'nestedData'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            /**
             * The rule is disabled due to unnecessary Storybook a11y bug.
             * The role `treegrid` has children with proper role `row`, but the error appears even then (but it should not).
             */
            id: 'aria-required-children',
            enabled: false
          }
        ]
      }
    }
  },
  args: {
    hideGuides: false,
    dataSource: undefined
  },
  argTypes: {
    dataSource: {
      table: { disable: true }
    },
    renderer: {
      table: { disable: true }
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ dataSource, hideGuides, renderer, scopedElements, styles }) => {
    const onToggle = () => dataSource?.selection.forEach(node => dataSource?.toggle(node)),
      onToggleDescendants = () => dataSource?.selection.forEach(node => dataSource?.toggleDescendants(node)),
      onExpandAll = () => dataSource?.expandAll(),
      onCollapseAll = () => dataSource?.collapseAll();

    return html`
      ${styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing}
      <sl-button-bar style="margin-block-end: 1rem">
        ${dataSource?.selects
          ? html`
              <sl-button @click=${onToggle}>Toggle selected</sl-button>
              <sl-button @click=${onToggleDescendants}>Toggle descendants</sl-button>
            `
          : nothing}
        <sl-button @click=${onExpandAll}>Expand all</sl-button>
        <sl-button @click=${onCollapseAll}>Collapse all</sl-button>
      </sl-button-bar>
      <sl-tree
        ?hide-guides=${hideGuides}
        .dataSource=${dataSource}
        .renderer=${renderer}
        .scopedElements=${scopedElements}
        aria-label="Tree label"
      ></sl-tree>
    `;
  }
} satisfies Meta<Props>;

export const FlatDataSource: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name)
    })
  }
};

export const NestedDataSource: Story = {
  args: {
    dataSource: new NestedTreeDataSource(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name)
    })
  }
};

export const SingleSelect: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      isSelected: ({ name }) => name === 'tree-node.ts',
      selects: 'single'
    })
  }
};

export const MultiSelect: Story = {
  args: {
    dataSource: new NestedTreeDataSource(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      isExpandable: ({ children }) => !!children,
      isSelected: ({ name }) => ['tree-node.scss', 'tree-node.ts'].includes(name),
      selects: 'multiple'
    })
  }
};

export const LazyLoad: Story = {
  args: {
    dataSource: new NestedTreeDataSource(
      [
        { id: '0-0', expandable: true },
        { id: '0-1', expandable: true },
        { id: '0-2', expandable: true },
        { id: '0-3' },
        { id: '0-4' }
      ] as LazyNestedDataNode[],
      {
        loadChildren: node => {
          return new Promise(resolve => {
            setTimeout(() => {
              const children = Array.from({ length: 10 }).map((_, i) => ({
                id: `${node.id}-${i}`,
                expandable: true
              }));

              resolve(children);
            }, 1000);
          });
        },
        getChildren: () => undefined,
        getId: ({ id }) => id,
        getLabel: ({ id }) => id,
        isExpandable: ({ expandable }) => !!expandable
      }
    )
  }
};

export const Skeleton: Story = {
  args: {
    dataSource: new NestedTreeDataSource(
      [
        { id: '0-0', expandable: true },
        { id: '0-1', expandable: true },
        { id: '0-2', expandable: true },
        { id: '0-3' },
        { id: '0-4' }
      ] as LazyNestedDataNode[],
      {
        loadChildren: node => {
          return new Promise(resolve => {
            setTimeout(() => {
              const children = Array.from({ length: 10 }).map((_, i) => ({
                id: `${node.id}-${i}`,
                expandable: true
              }));

              resolve(children);
            }, 1000);
          });
        },
        getChildren: () => undefined,
        getChildrenCount: ({ expandable }) => (expandable ? 10 : undefined),
        getId: ({ id }) => id,
        getLabel: ({ id }) => id,
        isExpandable: ({ expandable }) => !!expandable
      }
    )
  }
};

export const Scrolling: Story = {
  parameters: {
    // The size of the snapshot exceeds the maximum
    chromatic: { disableSnapshot: true }
  },
  args: {
    dataSource: new NestedTreeDataSource<NestedDataNode>(
      [1, 2, 3].map(id => ({
        id,
        name: `Root ${id}`,
        children: Array.from({ length: 1000 }).map((_, i) => ({ id: 1000 * id + i, name: `Child ${i}` }))
      })),
      {
        getChildren: ({ children }) => children,
        getId: ({ id }) => id,
        getLabel: ({ name }) => name,
        isExpandable: ({ children }) => !!children,
        isExpanded: () => true,
        isSelected: ({ id }) => id === 2010,
        selects: 'single'
      }
    )
  }
};

export const CustomRendererWithActionButtons: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      selects: 'single'
    }),
    renderer: node => {
      const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

      const onClickEdit = (event: Event) => {
        event.stopPropagation();
      };

      const onClickRemove = (event: Event) => {
        event.stopPropagation();
      };

      return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickEdit} aria-label="Edit">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickRemove} aria-label="Remove">
          <sl-icon name="far-trash"></sl-icon>
        </sl-button>
      `;
    },
    scopedElements: {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    }
  }
};

export const CustomRendererWithBadges: Story = {
  args: {
    ...FlatDataSource.args,
    renderer: node => {
      const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

      return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-badge color="blue" slot="aside">99</sl-badge>
      `;
    },
    scopedElements: {
      'sl-badge': Badge,
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    }
  }
};

export const SingleSelectWithActionButtons: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      selects: 'single'
    }),
    renderer: node => {
      const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

      const onClickEdit = (event: Event) => {
        event.stopPropagation();
      };

      const onClickRemove = (event: Event) => {
        event.stopPropagation();
      };

      return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickEdit} aria-label="Edit">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickRemove} aria-label="Remove">
          <sl-icon name="far-trash"></sl-icon>
        </sl-button>
      `;
    },
    scopedElements: {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    }
  }
};

export const MultiSelectWithBadges: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      selects: 'multiple'
    }),
    renderer: node => {
      const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

      return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-badge color="blue" slot="aside">99</sl-badge>
      `;
    },
    scopedElements: {
      'sl-badge': Badge,
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    }
  }
};
