import {
  faAtom,
  faCalculator,
  faChartArea,
  faChartLine,
  faCircle,
  faComments,
  faDna,
  faDrawPolygon,
  faFileLines,
  faFlask,
  faFolder,
  faFolderOpen,
  faGraduationCap,
  faHand,
  faLanguage,
  faLeaf,
  faLink,
  faListOl,
  faMicroscope,
  faPen,
  faShapes,
  faSpellCheck,
  faSquareRootVariable,
  faTableCells,
  faTrash
} from '@fortawesome/pro-regular-svg-icons';
import { Badge } from '@sl-design-system/badge';
import { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/search-field/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import '../register.js';
import { FlatTreeDataSource } from './flat-tree-data-source.js';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type TreeDataSourceNode } from './tree-data-source.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'dataSource' | 'hideGuides' | 'renderer' | 'scopedElements'> & {
  maxWidth?: string;
  styles?: string;
};
type Story = StoryObj<Props>;

export interface FlatDataNode {
  id: number;
  expandable: boolean;
  level: number;
  name: string;
  badge?: string;
}

export interface NestedDataNode {
  id: number;
  name: string;
  description?: string;
  children?: NestedDataNode[];
}

export interface LazyNestedDataNode {
  id: string;
  expandable?: boolean;
  children?:
    | LazyNestedDataNode[]
    | Promise<LazyNestedDataNode[]>
    | Array<Promise<LazyNestedDataNode>>;
}

Icon.register(
  faAtom,
  faCalculator,
  faChartArea,
  faChartLine,
  faCircle,
  faComments,
  faDna,
  faDrawPolygon,
  faFileLines,
  faFlask,
  faFolder,
  faFolderOpen,
  faGraduationCap,
  faHand,
  faLanguage,
  faLeaf,
  faLink,
  faListOl,
  faMicroscope,
  faPen,
  faShapes,
  faSpellCheck,
  faSquareRootVariable,
  faTableCells,
  faTrash
);

export const flatData: FlatDataNode[] = [
  {
    id: -1,
    expandable: true,
    level: 0,
    name: 'Location A',
    badge: '343'
  },
  {
    id: 0,
    expandable: true,
    level: 1,
    name: 'Upper school',
    badge: '316'
  },
  {
    id: 1,
    expandable: true,
    level: 2,
    name: 'MAVO',
    badge: '179'
  },
  {
    id: 2,
    expandable: false,
    level: 3,
    name: 'M3A'
  },
  {
    id: 3,
    expandable: true,
    level: 2,
    name: 'HAVO',
    badge: '108'
  },
  {
    id: 4,
    expandable: false,
    level: 3,
    name: 'H3A',
    badge: '26'
  },
  {
    id: 5,
    expandable: false,
    level: 3,
    name: 'H3B',
    badge: '24'
  },
  {
    id: 6,
    expandable: false,
    level: 3,
    name: 'H4A',
    badge: '28'
  },
  {
    id: 7,
    expandable: false,
    level: 3,
    name: 'H4B',
    badge: '30'
  },
  {
    id: 8,
    expandable: true,
    level: 2,
    name: 'VWO',
    badge: '29'
  },
  {
    id: 9,
    expandable: false,
    level: 3,
    name: 'V4A',
    badge: '29'
  },
  {
    id: 10,
    expandable: true,
    level: 1,
    name: 'Lower school',
    badge: '27'
  },
  {
    id: 11,
    expandable: true,
    level: 2,
    name: 'MAVO',
    badge: '27'
  },
  {
    id: 12,
    expandable: false,
    level: 3,
    name: 'M1A',
    badge: '27'
  }
];

export const nestedData: NestedDataNode[] = [
  {
    id: 0,
    name: 'Curriculum',
    children: [
      {
        id: 1,
        name: 'Mathematics',
        children: [
          {
            id: 2,
            name: 'Algebra I',
            children: [
              {
                id: 3,
                name: 'Linear Equations',
                description: 'Solving equations of the first degree'
              },
              {
                id: 4,
                name: 'Quadratic Functions',
                description: 'Parabolas and the quadratic formula'
              },
              {
                id: 5,
                name: 'Systems of Equations',
                description: 'Solving multiple equations at once'
              }
            ]
          },
          {
            id: 6,
            name: 'Geometry',
            children: [
              {
                id: 7,
                name: 'Triangles & Angles',
                description: 'Angle sums and triangle congruence'
              },
              { id: 8, name: 'Circle Theorems', description: 'Chords, tangents and arcs' }
            ]
          }
        ]
      },
      {
        id: 9,
        name: 'Science',
        children: [
          {
            id: 10,
            name: 'Biology',
            children: [
              { id: 11, name: 'Cell Structure', description: 'Organelles and their functions' },
              {
                id: 12,
                name: 'Photosynthesis',
                description: 'How plants convert light into energy'
              }
            ]
          },
          {
            id: 13,
            name: 'Chemistry',
            children: [
              {
                id: 14,
                name: 'The Periodic Table',
                description: 'Elements, groups and periods'
              },
              { id: 15, name: 'Chemical Bonding', description: 'Ionic and covalent bonds' }
            ]
          }
        ]
      },
      {
        id: 16,
        name: 'Languages',
        children: [
          {
            id: 17,
            name: 'Spanish',
            children: [
              { id: 18, name: 'Basic Greetings', description: 'Everyday words and phrases' },
              { id: 19, name: 'Verb Conjugation', description: 'Present tense regular verbs' }
            ]
          }
        ]
      }
    ]
  }
];

export default {
  title: 'Navigation/Tree',
  excludeStories: ['flatData', 'nestedData'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            /**
             * The rule is disabled due to unnecessary Storybook a11y bug. The role `treegrid` has
             * children with proper role `row`, but the error appears even then (but it should
             * not).
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
    dataSource: { table: { disable: true } },
    maxWidth: { table: { disable: true } },
    renderer: { table: { disable: true } },
    scopedElements: { table: { disable: true } },
    styles: { table: { disable: true } }
  },
  render: ({ dataSource, hideGuides, maxWidth, renderer, scopedElements, styles }) => {
    const onToggle = () => dataSource?.selection.forEach(node => dataSource?.toggle(node)),
      onToggleDescendants = () =>
        dataSource?.selection.forEach(node => dataSource?.toggleDescendants(node)),
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
        <sl-button @click=${onToggle}>Toggle selected</sl-button>
        <sl-button @click=${onToggleDescendants}>Toggle descendants</sl-button>
        <sl-button @click=${onExpandAll}>Expand all</sl-button>
        <sl-button @click=${onCollapseAll}>Collapse all</sl-button>
      </sl-button-bar>
      <sl-tree
        .dataSource=${dataSource}
        .renderer=${renderer}
        .scopedElements=${scopedElements}
        ?hide-guides=${hideGuides}
        aria-label="Tree label"
        style="max-inline-size: ${maxWidth ?? '300px'}"></sl-tree>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['Location A', 'Upper school', 'HAVO', 'VWO'].includes(name),
      isSelected: ({ name }) => name === 'H3B'
    })
  }
};

export const Badges: Story = {
  args: {
    dataSource: new FlatTreeDataSource(flatData, {
      getAriaDescription: ({ badge }) => (badge ? `${badge} students` : ''),
      getId: item => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['Location A', 'Upper school', 'HAVO', 'VWO'].includes(name),
      isSelected: ({ name }) => name === 'H3B'
    }),
    maxWidth: '250px',
    renderer: (node: TreeDataSourceNode<FlatDataNode>) => {
      return html`
        <span>${node.label}</span>
        <sl-badge color="blue" emphasis=${node.selected ? 'bold' : 'subtle'} slot="aside">
          ${node.dataNode.badge ?? '0'}
        </sl-badge>
      `;
    },
    scopedElements: { 'sl-badge': Badge }
  }
};

export const Buttons: Story = {
  args: {
    ...Basic.args,
    renderer: node => {
      // Don't show action buttons for expandable nodes; returning undefined
      // will make the tree use the default rendering.
      if (node.expandable) {
        return undefined;
      }

      const onClick = (event: Event) => event.stopPropagation();

      return html`
        <span>${node.label}</span>

        <sl-button @click=${onClick} aria-label="Edit" slot="actions">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-button @click=${onClick} aria-label="Remove" slot="actions">
          <sl-icon name="far-trash"></sl-icon>
        </sl-button>
      `;
    },
    scopedElements: {
      'sl-button': Button,
      'sl-icon': Icon
    }
  }
};

export const HideGuides: Story = {
  args: {
    ...Basic.args,
    hideGuides: true
  }
};

const curriculumIcons: Record<string, string> = {
  Curriculum: 'far-graduation-cap',
  Mathematics: 'far-calculator',
  'Algebra I': 'far-square-root-variable',
  'Linear Equations': 'far-chart-line',
  'Quadratic Functions': 'far-chart-area',
  'Systems of Equations': 'far-list-ol',
  Geometry: 'far-draw-polygon',
  'Triangles & Angles': 'far-shapes',
  'Circle Theorems': 'far-circle',
  Science: 'far-flask',
  Biology: 'far-dna',
  'Cell Structure': 'far-microscope',
  Photosynthesis: 'far-leaf',
  Chemistry: 'far-atom',
  'The Periodic Table': 'far-table-cells',
  'Chemical Bonding': 'far-link',
  Languages: 'far-language',
  Spanish: 'far-comments',
  'Basic Greetings': 'far-hand',
  'Verb Conjugation': 'far-spell-check'
};

export const Icons: Story = {
  args: {
    dataSource: new NestedTreeDataSource(nestedData, {
      getChildren: ({ children }) => children,
      getIcon: ({ name }) => curriculumIcons[name] ?? 'far-file-lines',
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children,
      isExpanded: ({ name }) => ['Curriculum', 'Mathematics', 'Algebra I'].includes(name)
    })
  }
};

export const Filter: Story = {
  args: {
    ...Icons.args
  },
  render: ({ hideGuides: showGuides }) => {
    const filterTree = (nodes: NestedDataNode[], regex: RegExp): NestedDataNode[] => {
      return nodes.reduce<NestedDataNode[]>((acc, node) => {
        const filteredChildren = node.children ? filterTree(node.children, regex) : undefined;
        const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;
        const isLeafMatch = !node.children && regex.test(node.name);

        if (isLeafMatch || hasMatchingChildren) {
          acc.push({ ...node, children: filteredChildren });
        }

        return acc;
      }, []);
    };

    const createDataSource = (filter?: string) => {
      const data = filter ? filterTree(nestedData, new RegExp(filter, 'i')) : nestedData;

      return new NestedTreeDataSource(data, {
        getChildren: ({ children }) => children,
        getIcon: ({ name }) => curriculumIcons[name] ?? 'far-file-lines',
        getId: item => item.id,
        getLabel: ({ name }) => name,
        isExpandable: ({ children }) => !!children,
        isExpanded: filter
          ? () => true
          : ({ name }) => ['Curriculum', 'Mathematics', 'Algebra I'].includes(name)
      });
    };

    let dataSource = createDataSource(),
      empty = false;

    const updateTree = (filter?: string) => {
      dataSource = createDataSource(filter);
      empty = !!filter && dataSource.size === 0;

      const tree = document.querySelector('sl-tree') as Tree;
      if (tree) {
        tree.dataSource = dataSource;
      }

      const msg = document.getElementById('no-results');
      if (msg) {
        msg.hidden = !empty;
      }
    };

    const onChange = (event: SlChangeEvent<string | undefined>): void => {
      updateTree(event.detail || undefined);
    };

    const onClear = () => {
      updateTree();
    };

    return html`
      <p style="margin-block: 0 1rem">
        This example shows how filtering can be implemented by creating a new data source with the
        filtered data and assigning it to the tree. Note that this <strong>does not</strong> use the
        Filter API of DataSource. That API hasn't been implemented yet.
      </p>
      <sl-search-field
        @sl-change=${onChange}
        @sl-clear=${onClear}
        placeholder="Filter the nodes in the tree"
        style="margin-block-end: 1rem"></sl-search-field>
      <sl-tree
        .dataSource=${dataSource}
        ?show-guides=${showGuides}
        aria-label="Filtered tree"
        style="max-inline-size: 300px"></sl-tree>
      <p id="no-results" ?hidden=${!empty}>No matching results.</p>
    `;
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
        isExpandable: ({ expandable }) => !!expandable,
        multiple: true
      }
    ),
    styles: 'sl-button-bar { display: none; }'
  }
};

export const Multiple: Story = {
  args: {
    dataSource: new NestedTreeDataSource(nestedData, {
      getChildren: ({ children }) => children,
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpanded: ({ name }) => ['Curriculum', 'Science', 'Biology'].includes(name),
      isExpandable: ({ children }) => !!children,
      isSelected: ({ name }) => ['Cell Structure', 'Photosynthesis'].includes(name),
      multiple: true
    }),
    hideGuides: true
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    styles: `
      sl-tree {
        block-size: 200px;
        border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
        border-radius: var(--sl-size-borderRadius-default);
        overflow: auto;
        padding: var(--sl-size-100);
      }
    `
  }
};

export const PageScrolling: Story = {
  parameters: {
    // The size of the snapshot exceeds the maximum
    chromatic: { disableSnapshot: true }
  },
  args: {
    dataSource: new NestedTreeDataSource<NestedDataNode>(
      [1, 2, 3].map(id => ({
        id,
        name: `Root ${id}`,
        children: Array.from({ length: 1000 }).map((_, i) => ({
          id: 1000 * id + i,
          name: `Child ${i}`
        }))
      })),
      {
        getChildren: ({ children }) => children,
        getId: ({ id }) => id,
        getLabel: ({ name }) => name,
        isExpandable: ({ children }) => !!children,
        isExpanded: () => true,
        isSelected: ({ id }) => id === 2010
      }
    )
  }
};

export const Selectable: Story = {
  args: {
    dataSource: new NestedTreeDataSource(nestedData, {
      getAriaDescription: ({ description }) => description,
      getChildren: ({ children }) => children,
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children,
      // Expand the path down to "Algebra I" so its leaf nodes are visible by default.
      isExpanded: ({ name }) => ['Curriculum', 'Mathematics', 'Algebra I'].includes(name),
      // Only the parent nodes are selectable, the leaf nodes are not.
      isSelectable: ({ children }) => !!children,
      multiple: true
    }),
    renderer: ({ dataNode, label }: TreeDataSourceNode<NestedDataNode>) => {
      // Only the leaf nodes have a description; other nodes use the default rendering.
      if (!dataNode?.description) {
        return undefined;
      }

      return html`
        <span style="display: flex; flex-direction: column">
          <span
            style="color: var(--sl-color-foreground-bold); font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);">
            ${label}
          </span>
          <span style="color: var(--sl-color-foreground-subtlest)"> ${dataNode.description} </span>
        </span>
      `;
    },
    hideGuides: true,
    maxWidth: '350px'
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

export const Sorting: Story = {
  render: () => {
    const ds = new NestedTreeDataSource(nestedData, {
      getChildren: ({ children }) => children,
      getId: item => item.id,
      getLabel: ({ name }) => name,
      isExpandable: ({ children }) => !!children,
      isExpanded: ({ name }) => ['Curriculum', 'Mathematics', 'Algebra I'].includes(name)
    });

    ds.setSort('name', 'asc');
    ds.update();

    return html`
      <sl-tree .dataSource=${ds} aria-label="Tree label" style="max-inline-size: 300px"></sl-tree>
    `;
  }
};
