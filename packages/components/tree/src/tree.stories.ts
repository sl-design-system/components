import { faFile, faFolder, faFolderOpen, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../register.js';
import { FlatTreeModel } from './flat-tree-model.js';
import { NestedTreeModel } from './nested-tree-model.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'hideGuides' | 'model' | 'renderer' | 'scopedElements'> & {
  styles?: string;
};
type Story = StoryObj<Props>;

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

interface LazyNestedDataNode {
  id: string;
  expandable?: boolean;
  children?: LazyNestedDataNode[] | Promise<LazyNestedDataNode[]> | Array<Promise<LazyNestedDataNode>>;
}

Icon.register(faFile, faFolder, faFolderOpen, faPen, faTrash);

const flatData: FlatDataNode[] = [
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

const nestedData: NestedDataNode[] = [
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
  args: {
    hideGuides: false,
    model: undefined
  },
  argTypes: {
    model: {
      table: { disable: true }
    },
    renderer: {
      table: { disable: true }
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ hideGuides, model, renderer, scopedElements, styles }) => {
    const onToggle = () => model?.selection.forEach(node => model?.toggle(node)),
      onToggleDescendants = () => model?.selection.forEach(node => model?.toggleDescendants(node)),
      onExpandAll = () => model?.expandAll(),
      onCollapseAll = () => model?.collapseAll();

    return html`
      ${styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing}
      <sl-button-bar style="margin-block-end: 1rem">
        ${model?.selects
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
        .model=${model}
        .renderer=${renderer}
        .scopedElements=${scopedElements}
      ></sl-tree>
    `;
  }
} satisfies Meta<Props>;

export const FlatModel: Story = {
  args: {
    model: new FlatTreeModel(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name)
    })
  }
};

export const NestedModel: Story = {
  args: {
    model: new NestedTreeModel(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name)
    })
  }
};

export const SingleSelect: Story = {
  args: {
    model: new FlatTreeModel(flatData, {
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
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
    model: new NestedTreeModel(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
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
    model: new NestedTreeModel(
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

// export const Skeleton: Story = {
//   args: {
//     model: new NestedTreeModel(
//       [
//         { id: '0-0', expandable: true },
//         { id: '0-1', expandable: true },
//         { id: '0-2', expandable: true },
//         { id: '0-3' },
//         { id: '0-4' }
//       ] as LazyNestedDataNode[],
//       {
//         getChildren: node => {
//           if (!node.children) {
//             node.children = Array.from({ length: 10 }).map((_, i) => {
//               return new Promise<LazyNestedDataNode>(resolve =>
//                 setTimeout(() => {
//                   resolve({ id: `${node.id}-${i}`, expandable: true });
//                 }, Math.random() * 4000)
//               );
//             });
//           }

//           return node.children;
//         },
//         getId: ({ id }) => id,
//         getLabel: ({ id }) => id,
//         isExpandable: ({ expandable }) => !!expandable
//       }
//     )
//   }
// };

export const CustomRenderer: Story = {
  args: {
    ...FlatModel.args,
    renderer: node => {
      const icon = node.label.includes('.') ? 'far-file' : `far-folder${node.expanded ? '-open' : ''}`;

      return html`
        ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>
        <sl-button-bar part="button-bar">
          <sl-button fill="ghost" size="sm">
            <sl-icon name="far-pen"></sl-icon>
          </sl-button>
          <sl-button fill="ghost" size="sm">
            <sl-icon name="far-trash"></sl-icon>
          </sl-button>
        </sl-button-bar>
      `;
    },
    scopedElements: {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    },
    styles: `
      sl-tree::part(button-bar) {
        flex: inherit;
        margin-inline-start: auto;
      }
    `
  }
};
