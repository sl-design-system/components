---
title: Tree View usage
tags: usage
eleventyNavigation:
  parent: Tree View
  key: TreeViewUsage
---
<section class="no-heading">

<div class="ds-example">
<sl-tag>Mathematics</sl-tag>
<sl-tag removable>History</sl-tag>
<sl-tag disabled removable>Science</sl-tag>
</div>

<div class="ds-code">

  ```html
<sl-tag>Mathematics</sl-tag>
<sl-tag removable>History</sl-tag>
<sl-tag disabled removable>Science</sl-tag>
  ```

</div>
</section>

<section>

## When to Use
The following guidance describes when to use the tree view component.

### Hierarchical Content
The Tree View is ideal for displaying and navigating hierarchical data, such as file systems, category structures, or organisational charts. It groups related data with nested relationships in a clear and organised way. It is a powerful tool for organising subject lesson content in educational applications. For example, it represents a syllabus with modules as parent nodes and lessons as child nodes, enabling students to intuitively explore and navigate their coursework. 

### SCENARIO 2
The Tree View allows users to dynamically expand or collapse data sections, enabling a cleaner interface that focuses only on relevant information. This interactive functionality is handy when managing large amounts of content, where each item contains complex data or detailed information. It ensures users can explore deeply without being overwhelmed.

</section>


<section>
## When Not to Use

### Simple Structures
Avoid using Tree View when your data is flat, only requires one level of nested information, or if a simpler component like an accordion or data table would suffice. This includes use cases like showing a single level of expandable content, such as FAQ answers. 

### Global Navigation
Do not use Tree View as the primary navigation for your product’s UI. For global sidebar navigation, it's better to use a dedicated UI Shell left panel that is more suited for this purpose.

### Elements Toggle
Tree View is not ideal for showing and hiding UI elements or content within a page. If the interaction only involves collapsing or expanding content at a basic level, consider using other components like accordions or dropdowns for a more straightforward solution.

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
Tree View comes in two versions, each suited for specific situations:

### Node
A basic element in the tree, representing a terminal item without parent or child nodes.

### Header Node
Section titles that group related nodes, helping organize and categorize data within the Tree View.

### Parent Node
A node that has one or more child nodes, typically expandable to reveal more detailed data.

### Child Node
A node nested under a parent node, typically hidden until the parent is expanded, representing more detailed or lower-level information.

</section>


<section>

## Options
FIGMA_OPTIONS_INTRODUCTION

|Item|Options|Description|
|-|-|-|
|PROP|`'on', 'of'`|PROPERTY DESCRIPTION |

{.ds-table .ds-table-align-top}

</section>


<section>

## Behaviours  
Let's explore the behaviour of the Tree View

### Selectable
When this feature is enabled, nodes can be selected by the user, allowing for interactions such as checking, highlighting, or performing actions on a specific node. This is useful when users need to select multiple items from the tree.

### Expandable
Allowing users to click on a parent node to reveal its child nodes. This interaction helps in navigating deeper structures without overwhelming the user with too much data at once. It is essential for managing large hierarchical datasets.

### Indentation
ndentation visually distinguishes parent nodes from their child nodes by shifting them to the right. This hierarchy helps users understand the relationship between different levels of the data quickly.

</section>


<section>

## Related Components

- [COMPONENT](/categories/components/COMPONENT/usage)

</section>
