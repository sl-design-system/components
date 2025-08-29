---
title: Tree code
tags: code
APIdescription: {
  sl-tree: "Tree has a range of properties to define the experience in different use cases.",
  sl-tree-node: "Tree list component provides properties to define the experience in different use cases, and it is a kind of wrapper for multiple tags."
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
    isExpanded: ({ name }) => ['tree', 'src'].includes(name),
    selects: 'single'
  });

  const renderer = (node) => {
    const fragment = document.createDocumentFragment();

    const iconName = node.label.includes('.')
      ? 'far-file-lines'
      : `far-folder${node.expanded ? '-open' : ''}`;
    if (iconName) {
      const iconElement = document.createElement('sl-icon');
      iconElement.setAttribute('size', 'sm');
      iconElement.name = iconName;
      fragment.appendChild(iconElement);
    }

    const label = document.createElement('span');
    label.textContent = node.label;
    fragment.appendChild(label);

    const editButton = document.createElement('sl-button');
    editButton.setAttribute('fill', 'ghost');
    editButton.setAttribute('size', 'sm');
    editButton.setAttribute('slot', 'actions');
    editButton.setAttribute('aria-label', 'Edit');
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    const editIcon = document.createElement('sl-icon');
    editIcon.name = 'far-pen';
    editButton.appendChild(editIcon);
    fragment.appendChild(editButton);

    const removeButton = document.createElement('sl-button');
    removeButton.setAttribute('fill', 'ghost');
    removeButton.setAttribute('size', 'sm');
    removeButton.setAttribute('slot', 'actions');
    removeButton.setAttribute('aria-label', 'Remove');
    removeButton.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    const removeIcon = document.createElement('sl-icon');
    removeIcon.name = 'far-trash';
    removeButton.appendChild(removeIcon);
    fragment.appendChild(removeButton);

    return fragment;
  };

  const tree = document.querySelector('sl-tree');
  tree.dataSource = dataSource;
  tree.renderer = renderer;
</script>

  ```

</div>

</section>
<ds-install-info link-in-navigation package="tree"></ds-install-info>
<section>

## Data source and custom rendering

**NOTE**
To get the tree working,
you will need to install the `@sl-design-system/data-source` package alongside `@sl-design-system/tree`.


The tree component requires a data source to supply structure and manage state.
This component provides `FlatTreeDataSource`, which adapts a flat array to a hierarchical view.

**What is a data source?**

In the Sanoma Learning Design System, a **data source** is a small adapter that normalizes your raw data into the view model that UI components use.
It centralizes filtering, sorting, selection, and emits sl-update when its view changes.
Multiple components (e.g. tree, grid, paginator) share the same base `DataSource` so behaviour stays consistent.
For tree, `FlatTreeDataSource` extends the base and maps a flat array with a level field into a hierarchical view while tracking expansion and selection.

A data source is the adapter that supplies the tree with items, their stable ids, labels, hierarchy \(via `level`\), expandability, and optional initial expansion/selection. The tree reads from it to render nodes and maintain expansion/selection and keyboard behavior consistently.
[More information about the **data source used in the tree** you can find below](#data-source-reference).

**What is a renderer function?**

The tree component supports custom rendering of nodes via a `renderer` function.
This allows you to add custom icons, buttons, or other interactive elements to each node.

Use a `renderer` to customize each node's content while preserving built\-in selection,
focus, and keyboard behavior.
The function receives the node's render data (`id`, `label`, `expanded`, `level`, and selection state)
and must return a `Node` or `DocumentFragment`.
More information about the `renderer` function is below.
[More information about the **rendered** function you can find below](#renderer-function).

### Data source reference

To get the tree working,
you will need to install the `@sl-design-system/data-source` package alongside `@sl-design-system/tree`.

The tree reads items from a data source to determine identity, labels, hierarchy, expandability, and initial expansion. This component ships `FlatTreeDataSource` for flat arrays that encode hierarchy via a `level`.

- Constructor
  - `new FlatTreeDataSource(items, options)`
- Required callbacks on `options`
  - `getId(item)` → unique, stable id \(`string`\|`number`\)
  - `getLabel(item)` → visible text
  - `getLevel(item)` → `number` \(`0` for root\)
  - `isExpandable(item)` → `boolean`
- Optional callbacks and flags
  - `isExpanded(item)` → `boolean` initial expansion
  - `getIcon(item, expanded)` → icon name when not using a custom `renderer`
  - `selects` → `'single'`\|`'multiple'`\|`'none'`
- Methods
  - `expandAll()` and `collapseAll()` utility helpers

What the tree uses:
- `id` to track focus, selection, and expansion state across updates.
- `label` for rendering, typeahead, and accessible names.
- `level` for indentation and `aria-level`.
- `isExpandable` to show/allow expansion.
- `isExpanded` only for initial render; runtime interactions can change it.
- `getIcon` only when no custom `renderer` provides its own icon.

Guidelines:
- Keep `id` values stable between renders.
- Ensure `level` reflects the visual order (`0`-based depth).
- If you render inline actions, call `e.stopPropagation()` and add `aria-label`s (to icon-only buttons).
- Prefer providing icons via `renderer`; when `renderer` is set, `getIcon` is ignored.

### Renderer function

A `renderer(node)` function lets you set how each node looks while keeping the built-in selection, focus, and keyboard features working.

- Function: `renderer(node)` → `Node`|`DocumentFragment`
- Input `node` fields: `id`, `label`, `level`, `expanded`, and selection state
- Output: a `Node` or `DocumentFragment` that becomes the node’s content

What the tree uses:
- Elements with `slot="actions"` are placed on the right as inline actions
- When a `renderer` is provided, `getIcon` from the data source is ignored for that node

Guidelines:
- Call `e.stopPropagation()` in inline action handlers to prevent unintended selection/expansion
- Add accessible names with `aria-label` to icon-only controls
- Do not mutate `node`; use tree APIs to change selection/expansion


#### Below you can find a **tree example** of a `flat data source` and a `custom renderer` function:

```javascript

<sl-tree aria-label="Project files"></sl-tree>

<script>
// Flat data example
const flatData = [
  { id: 0, expandable: true,  level: 0, name: 'docs' },
  { id: 1, expandable: false, level: 1, name: 'README.md' },
  { id: 2, expandable: true,  level: 0, name: 'src' },
  { id: 3, expandable: false, level: 1, name: 'index.ts' },
  { id: 4, expandable: false, level: 1, name: 'tree.ts' }
];

// Build a data source and control expansion
const dataSource = new FlatTreeDataSource(items, {
  getId: (item) => item.id,
  getLabel: (item) => item.name,
  getLevel: (item) => item.level, // 0-based depth in the flat list
  isExpandable: (item) => item.expandable,
  isExpanded: (item) => ['docs', 'src'].includes(item.name), // optional
  selects: 'multiple' // or 'single' | 'none'
});

// Optional custom renderer for each node
const renderTreeNode = (renderData) => {
  const fragment = document.createDocumentFragment();

  const icon = document.createElement('sl-icon');
  icon.name = renderData.label.includes('.')
    ? 'far-file-lines'
    : `far-folder${renderData.expanded ? '-open' : ''}`;
  icon.setAttribute('size', 'sm');
  fragment.appendChild(icon);

  const label = document.createElement('span');
  label.textContent = renderData.label;
  fragment.appendChild(label);

  const renameButton = document.createElement('sl-button');
  renameButton.setAttribute('slot', 'actions');
  renameButton.setAttribute('fill', 'ghost');
  renameButton.setAttribute('size', 'sm');
  renameButton.setAttribute('aria-label', 'Rename');
  renameButton.addEventListener('click', (event) => event.stopPropagation());
  const renameIcon = document.createElement('sl-icon');
  renameIcon.name = 'far-pen';
  renameButton.appendChild(renameIcon);
  fragment.appendChild(renameButton);

  return fragment;
};

const treeElement = document.querySelector('sl-tree');
treeElement.dataSource = dataSource;
treeElement.renderer = renderTreeNode;

// Helpers
// dataSource.expandAll();
// dataSource.collapseAll();

</script>
```

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
  isExpanded: ({ name }) => ['tree', 'src'].includes(name),
  selects: 'single'
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
  editBtn.setAttribute('fill', 'ghost');
  editBtn.setAttribute('size', 'sm');
  editBtn.setAttribute('slot', 'actions');
  editBtn.setAttribute('aria-label', 'Edit');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  const editIcon = document.createElement('sl-icon');
  editIcon.name = 'far-pen';
  editBtn.appendChild(editIcon);
  frag.appendChild(editBtn);

  const removeBtn = document.createElement('sl-button');
  removeBtn.setAttribute('fill', 'ghost');
  removeBtn.setAttribute('size', 'sm');
  removeBtn.setAttribute('slot', 'actions');
  removeBtn.setAttribute('aria-label', 'Remove');
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