import { faFile, faFolder, faFolderOpen } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { FlatTreeModel } from './flat-tree-model.js';
import { NestedTreeModel } from './nested-tree-model.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'expanded' | 'hideGuides' | 'model' | 'selected' | 'selects'>;
type Story = StoryObj<Props>;

interface NestedDataNode {
  id: number;
  name: string;
  children?: NestedDataNode[];
}

Icon.register(faFile, faFolder, faFolderOpen);

const flatData = [
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
    hideGuides: false
  },
  argTypes: {
    model: {
      table: { disable: true }
    },
    selects: {
      control: 'inline-radio',
      options: ['single', 'multiple']
    }
  },
  render: ({ expanded, hideGuides, model, selected, selects }) => {
    const onToggleTree = () => model?.toggle(4),
      onToggleTreeDescendants = () => model?.toggleDescendants(4),
      onExpandAll = () => model?.expandAll(),
      onCollapseAll = () => model?.collapseAll();

    return html`
      <sl-button-bar style="margin-block-end: 1rem">
        <sl-button @click=${onToggleTree}>Toggle "tree"</sl-button>
        <sl-button @click=${onToggleTreeDescendants}>Toggle all below "tree"</sl-button>
        <sl-button @click=${onExpandAll}>Expand all</sl-button>
        <sl-button @click=${onCollapseAll}>Collapse all</sl-button>
      </sl-button-bar>
      <sl-tree
        ?hide-guides=${hideGuides}
        .expanded=${expanded}
        .model=${model}
        .selected=${selected}
        .selects=${selects}
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
      isExpandable: ({ expandable }) => expandable
    }),
    expanded: [4, 5]
  }
};

export const NestedModel: Story = {
  args: {
    model: new NestedTreeModel(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children
    }),
    expanded: [4, 5]
  }
};

export const SingleSelect: Story = {
  args: {
    ...FlatModel.args,
    selected: 10,
    selects: 'single'
  }
};

export const MultiSelect: Story = {
  args: {
    ...FlatModel.args,
    selected: [9, 10],
    selects: 'multiple'
  }
};
