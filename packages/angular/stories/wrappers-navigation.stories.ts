import { Component } from '@angular/core';
import { faFileLines, faFolder, faFolderOpen } from '@fortawesome/pro-regular-svg-icons';
import { Icon as SlIcon } from '@sl-design-system/icon';
import { FlatTreeDataSource } from '@sl-design-system/tree';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { BreadcrumbsComponent } from '../src/breadcrumbs/breadcrumbs.component';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import { TabPanelComponent } from '../src/tabs/tab-panel.component';
import { TabComponent } from '../src/tabs/tab.component';
import { TreeComponent } from '../src/tree/tree.component';

SlIcon.register(faFileLines, faFolder, faFolderOpen);

type Item = { id: number; expandable: boolean; level: number; name: string };

@Component({
  selector: 'sla-tree-example',
  template: '<sl-tree [dataSource]="dataSource" aria-label="Subjects structure"></sl-tree>'
})
export class TreeExampleComponent {
  dataSource: FlatTreeDataSource<Item>;

  constructor() {
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

    this.dataSource = new FlatTreeDataSource<Item>(flatData, {
      getIcon: ({ name }: Item, expanded: boolean) =>
        name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
      getId: (item: Item) => item.id,
      getLabel: ({ name }: Item) => name,
      getLevel: ({ level }: Item) => level,
      isExpandable: ({ expandable }: Item) => expandable,
      isExpanded: ({ name }: Item) => ['tree', 'src'].includes(name),
      multiple: true
    });
  }
}

export default {
  title: 'Wrappers/Navigation',
  decorators: [
    moduleMetadata({
      imports: [
        BreadcrumbsComponent,
        TabComponent,
        TabGroupComponent,
        TabPanelComponent,
        TreeComponent,
        TreeExampleComponent
      ]
    })
  ]
} as Meta;

SlIcon.register(faFileLines, faFolder, faFolderOpen);

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

//turn this into a storyFN with a component
export const Tree: StoryObj = {
  render: () => ({
    description: `The TreeComponent provides a flexible way to render hierarchical data structures in Angular applications.
      It supports features such as node expansion/collapse, custom icons, and multi-selection.

      The example below demonstrates usage with a FlatTreeDataSource, which manages the tree state and provides methods for customizing node appearance and behavior. To implement, use &lt;sl-tree&gt; with a configured dataSource and provide item accessors for id, label, level, and expansion logic.`,
    template: '<sla-tree-example></sla-tree-example>'
  })
};
