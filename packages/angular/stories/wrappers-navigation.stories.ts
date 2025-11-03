import { faFileLines, faFolder, faFolderOpen } from '@fortawesome/pro-regular-svg-icons';
import { Icon as SlIcon } from '@sl-design-system/icon';
import { FlatTreeDataSource } from '@sl-design-system/tree';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { BreadcrumbsComponent } from '../src/breadcrumbs/breadcrumbs.component';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import { TabPanelComponent } from '../src/tabs/tab-panel.component';
import { TabComponent } from '../src/tabs/tab.component';
import { TreeComponent } from '../src/tree/tree.component';

export default {
  title: 'Wrappers/Navigation',
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbsComponent, TabComponent, TabGroupComponent, TabPanelComponent, TreeComponent]
    })
  ]
} as Meta;

SlIcon.register(faFileLines, faFolder, faFolderOpen);

export const Accordion: StoryObj = {
  render: () => ({
    template: `
      <sl-accordion>
        <sl-accordion-item summary="Item 1">Cupidatat id id velit aliqua ad ea do cillum do cillum qui.</sl-accordion-item>
        <sl-accordion-item summary="Item 2">Dolore velit aliqua ipsum mollit quis est officia nostrud quis nisi commodo cupidatat quis.</sl-accordion-item>
        <sl-accordion-item summary="Item 3">Adipisicing est ipsum ex quis ut mollit.</sl-accordion-item>
      </sl-accordion>
    `
  })
};

export const Breadcrumbs: StoryObj = {
  render: () => ({
    template: `
      <sl-breadcrumbs>
        <a href="javascript:void(0)">Lorem</a>
        <a href="javascript:void(0)">Ipsum</a>
        <a href="javascript:void(0)">Dolar</a>
      </sl-breadcrumbs>
    `
  })
};

export const Tabs: StoryObj = {
  render: () => ({
    template: `
      <sl-tab-group>
        <sl-tab>First tab</sl-tab>
        <sl-tab>Second tab</sl-tab>
        <sl-tab disabled>Disabled</sl-tab>
        <sl-tab-panel>Contents tab 1</sl-tab-panel>
        <sl-tab-panel>Contents tab 2</sl-tab-panel>
        <sl-tab-panel>Contents tab 3</sl-tab-panel>
      </sl-tab-group>
    `
  })
};

export const Tree: StoryObj = {
  render: () => {
    type Item = { id: number; expandable: boolean; level: number; name: string };

    const flatData: Item[] = [
      { id: 0, expandable: true, level: 0, name: 'Mathematics' },
      { id: 1, expandable: true, level: 1, name: 'Algebra' },
      { id: 2, expandable: false, level: 2, name: 'Lesson 1 - Linear equations.md' },
      { id: 3, expandable: false, level: 2, name: 'Lesson 2 - Quadratic equations.md' },
      { id: 4, expandable: true, level: 1, name: 'Geometry' },
      { id: 5, expandable: false, level: 2, name: 'Lesson 1 - Triangles.md' },
      { id: 6, expandable: false, level: 2, name: 'Lesson 2 - Circles.md' },
      { id: 21, expandable: false, level: 1, name: 'Lesson 20 - Statistics and probability.md' },
      { id: 7, expandable: true, level: 0, name: 'Science' },
      { id: 8, expandable: true, level: 1, name: 'Physics' },
      { id: 9, expandable: false, level: 2, name: 'Lesson 1 - Motion.md' },
      { id: 10, expandable: false, level: 2, name: 'Lesson 2 - Forces.md' },
      { id: 11, expandable: true, level: 1, name: 'Chemistry' },
      { id: 12, expandable: false, level: 2, name: 'Lesson 1 - Atoms.md' },
      { id: 13, expandable: false, level: 2, name: 'Lesson 2 - Reactions.md' },
      { id: 14, expandable: true, level: 0, name: 'History' },
      { id: 15, expandable: true, level: 1, name: 'Ancient Civilizations' },
      { id: 16, expandable: false, level: 2, name: 'Egypt.md' },
      { id: 17, expandable: false, level: 2, name: 'Rome.md' },
      { id: 18, expandable: true, level: 1, name: 'Modern History' },
      { id: 19, expandable: false, level: 2, name: 'World War I.md' },
      { id: 20, expandable: false, level: 2, name: 'World War II.md' }
    ];

    const dataSource = new FlatTreeDataSource<Item>(flatData, {
      getIcon: ({ name }: Item, expanded: boolean) =>
        name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
      getId: (item: Item) => item.id,
      getLabel: ({ name }: Item) => name,
      getLevel: ({ level }: Item) => level,
      isExpandable: ({ expandable }: Item) => expandable,
      isExpanded: ({ name }: Item) => ['tree', 'src'].includes(name),
      multiple: true
    });

    return {
      props: { dataSource },
      template: `
        <sl-tree [dataSource]="dataSource" aria-label="Subjects structure"></sl-tree>
      `
    };
  }
};
