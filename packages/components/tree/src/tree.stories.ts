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

type Props = Pick<
  Tree,
  'expanded' | 'hideGuides' | 'model' | 'renderer' | 'scopedElements' | 'selected' | 'selects'
> & { styles?: string };
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
    hideGuides: false
  },
  argTypes: {
    model: {
      table: { disable: true }
    },
    renderer: {
      table: { disable: true }
    },
    selects: {
      control: 'inline-radio',
      options: ['single', 'multiple']
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ expanded, hideGuides, model, renderer, scopedElements, selected, selects, styles }) => {
    const onToggleTree = () => model?.toggle(4),
      onToggleTreeDescendants = () => model?.toggleDescendants(4),
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
        <sl-button @click=${onToggleTree}>Toggle "tree"</sl-button>
        <sl-button @click=${onToggleTreeDescendants}>Toggle all below "tree"</sl-button>
        <sl-button @click=${onExpandAll}>Expand all</sl-button>
        <sl-button @click=${onCollapseAll}>Collapse all</sl-button>
      </sl-button-bar>
      <sl-tree
        ?hide-guides=${hideGuides}
        .expanded=${expanded}
        .model=${model}
        .renderer=${renderer}
        .scopedElements=${scopedElements}
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

export const CustomRenderer: Story = {
  args: {
    ...FlatModel.args,
    renderer: (node, { expanded }) => {
      const { name } = node as FlatDataNode,
        icon = name.includes('.') ? 'far-file' : `far-folder${expanded ? '-open' : ''}`;

      return html`
        ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
        <span>${name}</span>
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
