import { faFile, faFolder, faFolderOpen } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { FlatTreeModel } from './flat-tree-model.js';
import { NestedTreeModel } from './nested-tree-model.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'model' | 'selected' | 'selects'>;
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
  args: {},
  argTypes: {
    model: {
      table: { disable: true }
    },
    selects: {
      control: 'inline-radio',
      options: ['single', 'multiple']
    }
  },
  render: ({ model, selected, selects }) =>
    html`<sl-tree .model=${model} .selected=${selected} .selects=${selects}></sl-tree>`
} satisfies Meta<Props>;

export const FlatModel: Story = {
  args: {
    model: new FlatTreeModel(
      flatData,
      ({ name }) => name,
      ({ level }) => level,
      ({ expandable }) => expandable,
      {
        getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
        trackBy: item => item.id
      }
    )
  }
};

export const NestedModel: Story = {
  args: {
    model: new NestedTreeModel(
      nestedData,
      ({ children }) => children,
      ({ name }) => name,
      ({ children }) => !!children,
      {
        getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`),
        trackBy: item => item.id
      }
    )
  }
};

export const SingleSelect: Story = {
  args: {
    ...FlatModel.args,
    selected: 16,
    selects: 'single'
  }
};

export const MultiSelect: Story = {
  args: {
    ...FlatModel.args,
    selects: 'multiple'
  }
};
