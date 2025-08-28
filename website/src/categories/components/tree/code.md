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
<sl-tree aria-label="Tree example"></sl-tree>
</div>
</div>

<div class="ds-code">

  ```html
    <sl-tag-list stacked>
      <sl-tag removable>Mathematics</sl-tag>
      ...
      <sl-tag removable>English</sl-tag>
    </sl-tag-list>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="tree"></ds-install-info>
<section>

## Data source and custom rendering

The tree component supports custom rendering of nodes via a `renderer` function.
This allows you to add custom icons, buttons, or other interactive elements to each node.
Data source is a kind of utility that adapts your data to the tree's needs.
Data source is required to provide the tree structure and manage state.

Use a `renderer(node)` to customize each node's content while preserving built\-in selection,
focus, and keyboard behavior.
The function receives the node's render data (`id`, `label`, `expanded`, `level`, and selection state)
and must return a `Node` or `DocumentFragment`.

To place inline actions on the right, assign `slot="actions"` to your controls. Prevent unintended selection or expansion by calling `e.stopPropagation()` in event handlers. Add accessible names with `aria-label`; mark decorative icons with `aria-hidden="true"`.

<div>

For data, `FlatTreeDataSource(items, options)` adapts a flat array to a hierarchical view. 

Provide `getId`, `getLabel`, `getLevel`, `isExpandable`, and optionally `getIcon` and `isExpanded` for initial state.

Configure selection via `selects` \=`single`\|`multiple`\|`none`.

Utility methods `expandAll()` and `collapseAll()` are available.

</div>

```js
// Minimal example: custom renderer with icon and an inline action
const dataSource = new FlatTreeDataSource(items, {
  getId: i => i.id,
  getLabel: i => i.name,
  getLevel: i => i.level,
  isExpandable: i => i.expandable,
  selects: 'single'
});

const renderer = node => {
  const frag = document.createDocumentFragment();

  const icon = document.createElement('sl-icon');
  icon.name = node.label.includes('.') ? 'far-file-lines' : `far-folder${node.expanded ? '-open' : ''}`;
  icon.setAttribute('size', 'sm');
  icon.setAttribute('aria-hidden', 'true');
  frag.appendChild(icon);

  const text = document.createElement('span');
  text.textContent = node.label;
  frag.appendChild(text);

  const action = document.createElement('sl-button');
  action.setAttribute('slot', 'actions');
  action.setAttribute('fill', 'ghost');
  action.setAttribute('size', 'sm');
  action.setAttribute('aria-label', 'Rename');
  action.addEventListener('click', e => e.stopPropagation());
  const pen = document.createElement('sl-icon');
  pen.name = 'far-pen';
  action.appendChild(pen);
  frag.appendChild(action);

  return frag;
};

const tree = document.querySelector('sl-tree');
tree.setAttribute('aria-label', 'Project files');
tree.dataSource = dataSource;
tree.renderer = renderer;
```

**What is a data source?**  
A data source is the adapter that supplies the tree with items, their stable ids, labels, hierarchy \(via `level`\), expandability, and optional initial expansion/selection. The tree reads from it to render nodes and maintain expansion/selection and keyboard behavior consistently.

**How it is used here**  
This component provides `FlatTreeDataSource`, which adapts a flat array to a hierarchical view. You provide small callbacks: `getId`, `getLabel`, `getLevel`, `isExpandable` \(optional: `getIcon`, `isExpanded`\). Configure selection with `selects` \= `single`\|`multiple`\|`none`. Utility helpers `expandAll()` and `collapseAll()` are available.

**Quick start**
```javascript
const items = [
  { id: 0, expandable: true, level: 0, name: 'docs' },
  { id: 1, expandable: false, level: 1, name: 'README.md' }
];

const dataSource = new FlatTreeDataSource(items, {
  getId: i => i.id,
  getLabel: i => i.name,
  getLevel: i => i.level,
  isExpandable: i => i.expandable,
  // optional:
  // getIcon: ({ name }, expanded) => name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
  // isExpanded: ({ name }) => name === 'docs',
  selects: 'single'
});

const tree = document.querySelector('sl-tree');
tree.setAttribute('aria-label', 'Project files');
tree.dataSource = dataSource;
// optional custom content per node:
tree.renderer = renderer;
```

### What parts of the data source does the tree use?

- `id`: Stable, unique key used to track focus, selection, and expanded state. Keep it stable across updates.
- `label`: Visible text for each node. Also used for typeahead and accessible names.
- `level`: Zero\-based depth per item. Controls indentation and `aria\-level`.
- `isExpandable`: Whether a node can expand. Non\-expandable nodes ignore expand toggles.
- `isExpanded` \(`optional`\): Initial expansion state. User interactions and helpers like `expandAll()`/`collapseAll()` can override it at runtime.
- `getIcon` \(`optional`\): Returns an icon name when not using a custom `renderer`. If your `renderer` draws its own icon, this value is ignored for that node.
- `selects`: Selection model \(`single`\|`multiple`\|`none`\) that the tree enforces for keyboard/mouse behavior.

Guidelines:
- Ensure `id` values are stable so the tree can correctly preserve selection/focus between updates.
- Provide consistent `level` values; the array should reflect the visual order you expect.
- When adding inline actions in a custom `renderer`, call `e.stopPropagation()` and set `aria\-label` on controls; mark decorative icons `aria\-hidden="true"`.

```javascript
// Centralize icons and initial expansion via the data source
const ds = new FlatTreeDataSource(items, {
  getId: (i) => i.id,
  getLabel: (i) => i.name,
  getLevel: (i) => i.level,
  isExpandable: (i) => i.expandable,
  isExpanded: (i) => ['docs', 'src'].includes(i.name), // optional initial state
  getIcon: (i, expanded) =>
    i.name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`, // optional
  selects: 'multiple' // or 'single' | 'none'
});
```

### Data source reference

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
- Ensure `level` reflects the visual order \(`0`-based depth\).
- If you render inline actions, call `e.stopPropagation()` and add `aria-label`s; mark decorative icons with `aria-hidden="true"`.
- Prefer providing icons via `renderer`; when `renderer` is set, `getIcon` is ignored.

```javascript
// Build a data source and control expansion
const ds = new FlatTreeDataSource(items, {
  getId: i => i.id,
  getLabel: i => i.name,
  getLevel: i => i.level,      // 0-based depth in the flat list
  isExpandable: i => i.expandable,
  isExpanded: i => ['docs', 'src'].includes(i.name), // optional
  selects: 'multiple' // or 'single' | 'none'
});

const tree = document.querySelector('sl-tree');
tree.setAttribute('aria-label', 'Project files');
tree.dataSource = ds;

// Helpers
// ds.expandAll();
// ds.collapseAll();
```

</section>
{% include "../component-table.njk" %}

Tree component relies on a data source to provide the tree structure and manage state.
The `FlatTreeDataSource` is a built-in option that works well for many use cases.
It takes a flat array of items and uses callback functions to extract the necessary information.


// Optional helpers:
// dataSource.expandAll();
// dataSource.collapseAll();

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
    console.log('Edit', node);
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
    console.log('Remove', node);
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