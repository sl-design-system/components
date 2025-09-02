---
title: Tree usage
tags: usage
eleventyNavigation:
  parent: Tree
  key: TreeUsage
---
<style>
.ds-example__tree {
  inline-size: 400px;
}
</style>
<section class="no-heading">

<div class="ds-example">
<div class="ds-example__tree">
<sl-tree id="tree" aria-label="Subjects structure"></sl-tree>
</div>
</div>

<div class="ds-code">

  ```html
<sl-tree id="tree" aria-label="Subjects structure"></sl-tree>

<script type="module">
  import { FlatTreeDataSource } from '@sl-design-system/tree';
  
  const tree = document.querySelector('#tree');
  
    const flatData = [
      { id: 0, expandable: true, level: 0, name: 'Mathematics' },
      { id: 1, expandable: true, level: 1, name: 'Algebra' },
      { id: 2, expandable: false, level: 2, name: 'Lesson 1 - Linear equations.md' },
      { id: 3, expandable: false, level: 2, name: 'Lesson 2 - Quadratic equations.md' },
      { id: 4, expandable: true, level: 1, name: 'Geometry' },
      ...
      { id: 18, expandable: true, level: 1, name: 'Modern History' },
      { id: 19, expandable: false, level: 2, name: 'World War I.md' },
      { id: 20, expandable: false, level: 2, name: 'World War II.md' }
    ];

    const dataSource = new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) =>
        name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
      getId: (item) => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      selects: 'multiple'
    });
  
    tree.dataSource = dataSource;
</script>
  ```

</div>
</section>

<section>

## When to use
The following guidance describes when to use the tree component.

### Hierarchical Content
The Tree is ideal for displaying and navigating hierarchical data, such as file systems, category structures, or organisational charts. It groups related data with nested relationships in a clear and organised way. It is a powerful tool for organising subject lesson content in educational applications. For example, it represents a syllabus with modules as parent nodes and lessons as child nodes, enabling students to intuitively explore and navigate their coursework. 

### Collapsable Data
The Tree allows users to dynamically expand or collapse data sections, enabling a cleaner interface that focuses only on relevant information. This interactive functionality is handy when managing large amounts of content, where each item contains complex data or detailed information. It ensures users can explore deeply without being overwhelmed.

</section>


<section>

## When not to use

### Simple Structures
Avoid using Tree when your data is flat and only requires a single level of expansion. In these cases, an Accordion is more suitable, as it is designed to condense flat content, such as FAQ pages, making the content easier to scan and interact with, without the added complexity.

### Global Navigation
Do not use Tree as the primary navigation for your product’s UI. The tree component is not suitable for this purpose.

### Elements Toggle
The tree is not ideal for showing and hiding UI elements or content within a page. If the interaction only involves collapsing or expanding content at a basic level, consider using other components like accordions or collapsable panels for a more straightforward solution.

</section>


<section>

## Anatomy

|Item|Name|Description|Optional|
|-|-|-|-|
|1|Title|The main text label of the node, representing the name or identifier of the item in the hierarchy.|no|
|2|Toggle|An interactive element that allows users to expand or collapse child nodes under the parent node.|Yes|
|3|Icon|A visual indicator representing the type or state of the node.|Yes|
|4|Checkbox|A selectable option that allows users to select or deselect nodes.|Yes|
|5|Guide Lines|Visual lines used to indicate the hierarchical structure of the tree.|Yes|
|6|Indentation|The visual offset of child nodes to indicate their relationship with parent nodes.|Yes|

{.ds-table .ds-table-align-top}

</section>


<section>

## Variants
Tree comes in two versions, each suited for specific situations:

### Node
A basic element in the tree, representing a terminal item without parent or child nodes.

### Parent Node
A node that has one or more child nodes, typically expandable to reveal more detailed data.

### Child Node
A node nested under a parent node, typically hidden until the parent is expanded, representing more detailed or lower-level information.

</section>


<section>

## Figma Options
With these options, you can tweak the appearance of the Tree in Figma. They are available in the Design Panel so you can compose the switch to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Variant|`'Child', 'Parent'`|Defines whether the node behaves as a parent with expandable content or a child item.|
|Expanded|`'on', 'off'`|Toggles whether the parent node is expanded to show its children.|
|Multiselect|`'on', 'off'`|Enables the ability to select multiple nodes at once.|
|Selected|`'on', 'off'`|Indicates whether the node is currently selected.|
|Node Label|`Text`|The text label displayed as the node’s title.|
|Icon|`'on', 'off'`|Shows or hides the icon associated with the node (e.g., folder, file).|
|showFocus|`'on', 'off'`|Displays a focus ring around the node when active.|
|Level|`'1' to '6'`|Sets the hierarchy level to control indentation.|
|hideGuides|`'on', 'off'`|Shows or hides the connector guides between parent and child nodes.|
|Actions Type|`'Badge', 'Button Bar'`|Toggles additional actions available on the node (e.g., edit, delete).|
|State|`'idle', 'hover', 'active'`|Represents the interactive state of the node (e.g., default, hover).|
|Selected|`'on', 'off'`|Indicates if the node is selected in its current state.|

{.ds-table .ds-table-align-top}

</section>


<section>

## Behaviour
Let's explore the behaviour of the Tree.

### Selectable
When this feature is enabled, nodes can be selected by the user, allowing for interactions such as checking, highlighting, or performing actions on a specific node.

### Multiple Selection
When this feature is enabled, users can select multiple nodes at the same time, allowing interactions such as checking, highlighting, or performing actions on several nodes simultaneously. Single selection is disabled in this mode to simplify user interaction.

### Expandable
Allowing users to click on a parent node to reveal its child nodes. This interaction helps in navigating deeper structures without overwhelming the user with too much data at once. It is essential for managing large hierarchical datasets.

### Indentation
Indentation visually distinguishes parent nodes from their child nodes by shifting them to the right. This hierarchy helps users understand the relationship between different levels of the data quickly.

</section>


<section>

## Related Components

- [Badge](/categories/components/badge/usage)
- [Checkbox](/categories/components/checkbox/usage)
- [Icon](/categories/components/icon/usage)

</section>

<script type="module">
  const tree = document.querySelector('#tree');
  if (!tree) {
    console.warn('sl-tree element with id \`tree\` not found');
  } else {
    const flatData = [
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

    const dataSource = new FlatTreeDataSource(flatData, {
      getIcon: ({ name }, expanded) =>
        name.includes('.') ? 'far-file-lines' : `far-folder${expanded ? '-open' : ''}`,
      getId: (item) => item.id,
      getLabel: ({ name }) => name,
      getLevel: ({ level }) => level,
      isExpandable: ({ expandable }) => expandable,
      isExpanded: ({ name }) => ['tree', 'src'].includes(name),
      selects: 'multiple'
    });

    (async () => {
      await customElements.whenDefined('sl-tree');
      tree.dataSource = dataSource;
    })();
  }
</script>
