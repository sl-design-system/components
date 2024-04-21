import { faFile, faFolder } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { FlatTreeModel } from './flat-tree-model.js';
import { NestedTreeModel } from './nested-tree-model.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'model' | 'selects'>;
type Story = StoryObj<Props>;

Icon.register(faFile, faFolder);

const flatData = [
  {
    level: 0,
    name: 'tree',
    icon: 'far-folder'
  },
  {
    level: 1,
    name: 'src',
    icon: 'far-folder'
  },
  {
    level: 2,
    name: 'flat-tree-model.ts',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'nested-tree-model.ts',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'tree-model.ts',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'tree-node.scss',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'tree-node.ts',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'tree.ts',
    icon: 'far-file'
  },
  {
    level: 2,
    name: 'utils.ts',
    icon: 'far-file'
  },
  {
    level: 1,
    name: 'index.ts',
    icon: 'far-file'
  },
  {
    level: 1,
    name: 'package.json',
    icon: 'far-file'
  },
  {
    level: 1,
    name: 'register.ts',
    icon: 'far-file'
  }
];

const nestedData = [
  {
    name: 'tree',
    children: [
      {
        name: 'src',
        children: [
          { name: 'flat-tree-model.ts' },
          { name: 'nested-tree-model.ts' },
          { name: 'tree-model.ts' },
          { name: 'tree-node.scss' },
          { name: 'tree-node.ts' },
          { name: 'tree.ts' },
          { name: 'utils.ts' }
        ]
      },
      { name: 'index.ts' },
      { name: 'package.json' },
      { name: 'register.ts' }
    ]
  }
];

export default {
  title: 'In progress/Tree',
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
  render: ({ model, selects }) => html`<sl-tree .model=${model} .selects=${selects}></sl-tree>`
} satisfies Meta<Props>;

export const Flat: Story = {
  args: {
    model: new FlatTreeModel(flatData, 'level', 'name', 'icon')
  }
};

export const Nested: Story = {
  args: {
    model: new NestedTreeModel(nestedData, 'children', 'name')
  }
};

export const SingleSelect: Story = {
  args: {
    ...Flat.args,
    selects: 'single'
  }
};

export const MultiSelect: Story = {
  args: {
    ...Flat.args,
    selects: 'multiple'
  }
};
