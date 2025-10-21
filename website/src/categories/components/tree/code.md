---
title: Tree code
tags: code
APIdescription: {
  sl-tree: "The tree API exposes a comprehensive set of properties, events, and customization options, enabling developers to tailor its behavior, appearance, and interaction patterns for diverse use cases."
}
eleventyNavigation:
  parent: Tree
  key: TreeCode
---
<style>
.ds-example__tree {
  min-inline-size: 400px;
}
</style>
<section>

<div class="ds-example">
<div class="ds-example__tree">
<sl-tree aria-label="Files structure"></sl-tree>
</div>
</div>

<div class="ds-code">

  ```html
<sl-tree aria-label="Files structure"></sl-tree>

<script type="module">
    import { html, nothing } from 'lit';
    import { FlatTreeDataSource } from '@sl-design-system/tree';

    const flatData = [
      { id: 0, expandable: true, level: 0, name: 'textarea' },
      { id: 1, expandable: false, level: 1, name: 'package.json' },
      { id: 2, expandable: true, level: 0, name: 'tree' },
      { id: 3, expandable: true, level: 1, name: 'src' },
      { id: 4, expandable: false, level: 2, name: 'tree-node.ts' }
    ];

    const dataSource = new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) =>
        name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
      getId: (item) => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name)
    });

    const renderer = (node) => {
      const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

      const onClickEdit = (event) => event.stopPropagation();
      const onClickRemove = (event) => event.stopPropagation();

      return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-button @click=${onClickEdit} aria-label="Edit" slot="actions">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-button @click=${onClickRemove} aria-label="Remove" slot="actions"s>
          <sl-icon name="far-trash"></sl-icon>
        </sl-button>
      `;
    }

    const tree = document.querySelector('sl-tree');
    tree.dataSource = dataSource;
    tree.renderer = renderer;
</script>

  ```

</div>

</section>
<ds-install-info link-in-navigation package="tree"></ds-install-info>
<section>

## Tree data source

The tree component requires a data source to supply structure and manage state. This component provides `FlatTreeDataSource`, which adapts a flat array to a hierarchical view, and `NestedTreeDataSource`, which works directly with nested tree-structured data.

**What is a data source?**

A **data source** is an adapter that normalizes your raw data into the view model that UI components use.
It centralizes filtering, sorting, selection, and emits events when its state changes.
Multiple components (e.g. tree, grid, paginator) share the same base `DataSource` so behaviour stays consistent.

For tree, `FlatTreeDataSource` extends the base and maps a flat array with a level field into a hierarchical view while tracking expansion and selection. Alternatively, you can use `NestedTreeDataSource` if your data is already structured as a nested tree, allowing you to work directly with hierarchical data without flattening it first. Both extend the base `TreeDataSource`.

Both tree data sources do not enforce a specific data shape. Instead, you provide callback functions to extract ids, labels, levels, children, and expansion state from your items. The data source will use these callbacks to build the tree structure and manage state.

```ts
export interface TreeDataSourceMapping<T> {
  /** Optional method for returning a custom aria description for a tree node. */
  getAriaDescription?(item: T): string | undefined;

  /**
   * Returns the number of children. This can be used in combination with
   * lazy loading children. This way, the tree component can show skeletons
   * for the children while they are being loaded.
   */
  getChildrenCount?(item: T): number | undefined;

  /** Optional method for returning a custom icon for a tree node. */
  getIcon?(item: T, expanded: boolean): string;

  /** Used to identify a tree node. */
  getId(item: T): unknown;

  /**
   * Returns a string that is used as the label for the tree node.
   * If you want to customize how the tree node is rendered, you can
   * provide your own `TreeItemRenderer` function to the tree component.
   */
  getLabel(item: T): string;

  /** Returns whether the given node is expandable. */
  isExpandable(item: T): boolean;

  /**
   * Returns whether the given node is expanded. This is only used for the initial
   * expanded state of the node. If you want to expand/collapse a node programmatically,
   * use the `expand` and `collapse` methods on the data source.
   */
  isExpanded?(item: T): boolean;

  /**
   * Returns whether the given node is selected. This is only used for the initial
   * selected state of the node. If you want to select/deselect a node programmatically,
   * use the `select` and `deselect` methods on the data source.
   */
  isSelected?(item: T): boolean;
}
```

Depending on whether you use `FlatTreeDataSource` or `NestedTreeDataSource`, you will need to provide additional mapping functions:

```ts
export interface FlatTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  /** Returns the level in the tree of the given item. */
  getLevel(item: T): number;
}
```

or

```ts
export interface NestedTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  /** Returns the children of the given item. */
  getChildren(item: T): T[] | Promise<T[]> | undefined;
}
```

</section>

<section>

## Custom renderer

The tree component renders the tree nodes by default using the label and icon provided by the data source. It does this using a virtual list, so it can efficiently render large trees. This also means that you cannot use regular slot-based templating to customize the rendering of tree nodes.

The tree component provides a `renderer` callback function that supports custom rendering of nodes. This allows you to add custom icons, buttons, or other interactive elements to each node.

```ts
const renderer = node => {
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
};
```

Do not forget to specify any scoped elements you use in your renderer in the `scopedElements` property of the `<sl-tree>` component.

```ts
const tree = document.querySelector('sl-tree');
tree.renderer = renderer;
tree.scopedElements = { 'sl-button': Button };
```

Some, such as `<sl-icon>`, are already included by default.

</section>

{% include "../component-table.njk" %}

<script type="module">
const flatData = [
  { id: 0, expandable: true, level: 0, name: 'textarea' },
  { id: 1, expandable: false, level: 1, name: 'package.json' },
  { id: 2, expandable: true, level: 0, name: 'tree' },
  { id: 3, expandable: true, level: 1, name: 'src' },
  { id: 4, expandable: false, level: 2, name: 'tree-node.ts' }
];

const dataSource = new FlatTreeDataSource(flatData, {
  getIcon: ({ name }, expanded) =>
    name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
  getId: (item) => item.id,
  getLabel: ({ name }) => name,
  getLevel: ({ level }) => level,
  isExpandable: ({ expandable }) => expandable,
  isExpanded: ({ name }) => ['tree', 'src'].includes(name)
});

const renderer = (node) => {
  const frag = document.createDocumentFragment();

  const iconName = node.label.includes('.')
    ? 'far-file-lines'
    : `far-folder${node.expanded ? '-open' : ''}`;
  if (iconName) {
    const iconEl = document.createElement('sl-icon');
    iconEl.setAttribute('size', 'sm');
    iconEl.name = iconName;
    frag.appendChild(iconEl);
  }

  const label = document.createElement('span');
  label.textContent = node.label;
  frag.appendChild(label);

  const editBtn = document.createElement('sl-button');
  editBtn.setAttribute('aria-label', 'Edit');
  editBtn.setAttribute('slot', 'actions');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  const editIcon = document.createElement('sl-icon');
  editIcon.name = 'far-pen';
  editBtn.appendChild(editIcon);
  frag.appendChild(editBtn);

  const removeBtn = document.createElement('sl-button');
  removeBtn.setAttribute('aria-label', 'Remove');
  removeBtn.setAttribute('slot', 'actions');
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  const removeIcon = document.createElement('sl-icon');
  removeIcon.name = 'far-trash';
  removeBtn.appendChild(removeIcon);
  frag.appendChild(removeBtn);

  return frag;
};

const tree = document.querySelector('sl-tree');
tree.dataSource = dataSource;
tree.renderer = renderer;
</script>