---
title: Tree
layout: docs
eleventyNavigation:
  key: Tree
  parent: Navigation
---

`<sl-tree>` displays hierarchical data as a tree that can be expanded, collapsed and selected. It is
virtualized, so it stays performant even with very large data sets.

The data is provided through a **data source** rather than slotted markup. Use `FlatTreeDataSource`
when your data is a flat array with a level on each item, or `NestedTreeDataSource` when your data is
already nested with children.

## Usage

Set the `dataSource` property to a configured data source. The configuration tells the tree how to
read each item — its id, label, level, and whether it is expandable, expanded or selected.

```html
<sl-tree id="tree"></sl-tree>

<script type="module">
  import { FlatTreeDataSource } from '@sl-design-system/tree';

  const data = [
    { id: 0, level: 0, name: 'Location A', expandable: true },
    { id: 1, level: 1, name: 'Upper school', expandable: true },
    { id: 2, level: 2, name: 'HAVO', expandable: false },
    { id: 3, level: 2, name: 'VWO', expandable: false },
    { id: 4, level: 0, name: 'Location B', expandable: false }
  ];

  document.getElementById('tree').dataSource = new FlatTreeDataSource(data, {
    getId: item => item.id,
    getLabel: item => item.name,
    getLevel: item => item.level,
    isExpandable: item => item.expandable,
    isExpanded: item => ['Location A', 'Upper school'].includes(item.name)
  });
</script>
```

## Nested data

If your data already has a nested shape, use `NestedTreeDataSource` and tell it how to read each
node's children.

```js
import { NestedTreeDataSource } from '@sl-design-system/tree';

const dataSource = new NestedTreeDataSource(data, {
  getId: item => item.id,
  getLabel: item => item.name,
  getChildren: item => item.children
});
```

## Options

hideGuides
: Set the `hide-guides` attribute to hide the indentation guide lines.

renderer
: Provide a `renderer` function to customise how each node is rendered — for example to add icons,
  badges or buttons.

## Selection

The data source exposes the current `selection` and methods such as `toggle`, `expandAll` and
`collapseAll`. Enable selecting multiple nodes through the data source's selection configuration.

```js
// React to selection changes
tree.dataSource.addEventListener('sl-selection-change', () => {
  console.log([...tree.dataSource.selection]);
});
```

## API

`<sl-tree>` is configured through the `dataSource`, `renderer` and `hide-guides` properties. See the
[source on GitHub](https://github.com/sl-design-system/components/tree/main/packages/components/tree)
for the full API.
