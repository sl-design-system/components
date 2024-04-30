import { faFile, faFolder, faFolderOpen } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { FlatTreeModel } from './flat-tree-model.js';
import { NestedTreeModel } from './nested-tree-model.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'model' | 'selects'>;
type Story = StoryObj<Props>;

interface NestedDataNode {
  name: string;
  children?: NestedDataNode[];
}

Icon.register(faFile, faFolder, faFolderOpen);

const flatData = [
  {
    expandable: true,
    level: 0,
    name: 'tree'
  },
  {
    expandable: true,
    level: 1,
    name: 'src'
  },
  {
    expandable: false,
    level: 2,
    name: 'flat-tree-model.ts'
  },
  {
    expandable: false,
    level: 2,
    name: 'nested-tree-model.ts'
  },
  {
    expandable: false,
    level: 2,
    name: 'tree-model.ts'
  },
  {
    expandable: false,
    level: 2,
    name: 'tree-node.scss'
  },
  {
    expandable: false,
    level: 2,
    name: 'tree-node.ts'
  },
  {
    expandable: false,
    level: 2,
    name: 'tree.ts'
  },
  {
    expandable: false,
    level: 2,
    name: 'utils.ts'
  },
  {
    expandable: false,
    level: 1,
    name: 'index.ts'
  },
  {
    expandable: false,
    level: 1,
    name: 'package.json'
  },
  {
    expandable: false,
    level: 1,
    name: 'register.ts'
  }
];

const nestedData: NestedDataNode[] = [
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
    model: new FlatTreeModel(
      flatData,
      ({ name }) => name,
      ({ level }) => level,
      ({ expandable }) => expandable,
      {
        getIcon: ({ name }, expanded) => (name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`)
      }
    )
  }
};

export const Nested: Story = {
  args: {
    model: new NestedTreeModel(
      nestedData,
      dataNode => dataNode.children,
      dataNode => dataNode.name,
      dataNode => !!dataNode.children
    )
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
