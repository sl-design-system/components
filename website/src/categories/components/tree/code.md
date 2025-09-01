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
    isExpanded: ({ name }) => ['tree', 'src'].includes(name),
    selects: 'single'
  });

  const renderer = (node) => {
    const icon = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;

    const onClickEdit = (event) => {
      event.stopPropagation();
    };

    const onClickRemove = (event) => {
      event.stopPropagation();
    };

    return html`
        ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
        <span>${node.label}</span>

        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickEdit} aria-label="Edit">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" size="sm" slot="actions" @click=${onClickRemove} aria-label="Remove">
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

## Data source and custom rendering

The tree component requires a data source to supply structure and manage state.
This component provides `FlatTreeDataSource`, which adapts a flat array to a hierarchical view,
and `NestedTreeDataSource`, which works directly with nested tree-structured data.

**What is a data source?**

In the Sanoma Learning Design System, a **data source** is a small adapter that normalizes your raw data into the view model that UI components use.
It centralizes filtering, sorting, selection, and emits sl-update when its view changes.
Multiple components (e.g. tree, grid, paginator) share the same base `DataSource` so behaviour stays consistent.
For tree, `FlatTreeDataSource` extends the base and maps a flat array with a level field into a hierarchical view while tracking expansion and selection.
Alternatively, you can use `NestedTreeDataSource` if your data is already structured as a nested tree, allowing you to work directly with hierarchical data without flattening it first.

A data source is the adapter that supplies the tree with items, their stable ids, labels, hierarchy \(via `level`\), expandability, and optional initial expansion/selection. The tree reads from it to render nodes and maintain expansion/selection and keyboard behavior consistently.
[More information about the **data source used in the tree** you can find below](#data-source-reference).

**What is a renderer function?**

The tree component supports custom rendering of nodes via a `renderer` function.
This allows you to add custom icons, buttons, or other interactive elements to each node.

Use a `renderer` to customize each node's content while preserving built\-in selection,
focus, and keyboard behavior.
The function receives the node's render data (`id`, `label`, `expanded`, `level`, and selection state)
and must return a `TemplateResult` or `Node` or `DocumentFragment`.
More information about the `renderer` function is below.
[More information about the **rendered** function you can find below](#renderer-function).

### Data source reference

The tree reads items from a data source to determine identity, labels, hierarchy, expandability, and initial expansion. This component ships with two data sources:

- `FlatTreeDataSource` for flat arrays that encode hierarchy via a `level` property.
- `NestedTreeDataSource` for data already structured as a nested tree (children as arrays).

#### FlatTreeDataSource

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

#### NestedTreeDataSource

- Constructor
  - `new NestedTreeDataSource(items, options)`
- Required callbacks on `options`
  - `getId(item)` → unique, stable id
  - `getLabel(item)` → visible text
  - `getChildren(item)` → array of children or `undefined`
- Optional callbacks and flags
  - `isExpanded(item)` → `boolean` initial expansion
  - `getIcon(item, expanded)` → icon name when not using a custom `renderer`
  - `selects` → `'single'`\|`'multiple'`\|`'none'`
- Methods
  - `expandAll()` and `collapseAll()` utility helpers

What the tree uses:
- `id` to track focus, selection, and expansion state across updates.
- `label` for rendering, typeahead, and accessible names.
- `level` (for flat) or hierarchy (for nested) for indentation and `aria-level`.
- `isExpandable`/`getChildren` to show/allow expansion.
- `isExpanded` only for initial render; runtime interactions can change it.
- `getIcon` only when no custom `renderer` provides its own icon.

Guidelines:
- Keep `id` values stable between renders.
- Ensure `level` (flat) or children (nested) reflect the visual order.
- If you render inline actions, call `e.stopPropagation()` and add `aria-label`s (to icon-only buttons).
- Prefer providing icons via `renderer`; when `renderer` is set, `getIcon` is ignored.

### Renderer function

A `renderer(node)` function lets you set how each node looks while keeping the built-in selection, focus, and keyboard features working.

- Function: `renderer(node)` → `Node`|`TemplateResult`|`DocumentFragment`
- Input `node` fields: `id`, `label`, `level`, `expanded`, and selection state
- Output: a `Node` of `TemplateResult` or `DocumentFragment` that becomes the node’s content

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

<script type="module">
// Use FlatTreeDataSource
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
  
// or use NestedTreeDataSource for nested data:
  // Nested data example
  const nestedData = [
  {
    id: 0,
    name: 'docs',
    children: [
      { id: 1, name: 'README.md' }
    ]
  },
  {
    id: 2,
    name: 'src',
    children: [
      { id: 3, name: 'index.ts' },
      { id: 4, name: 'tree.ts' }
    ]
  }
  ];

  // Build a data source and control expansion
  const dataSource = new NestedTreeDataSource(nestedData, {
    getId: (item) => item.id,
    getLabel: (item) => item.name,
    getChildren: (item) => item.children,
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