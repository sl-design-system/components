---
title: Tree accessibility
tags: accessibility
eleventyNavigation:
  parent: Tree
  key: TreeAccessibility
---
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

| Command       |Description|
|---------------|-|
| Tab           |Moves focus into the tree (to the first visible node) or to the next focusable element when leaving the tree. Inline action controls inside a node are tabbable.|
| Shift + Tab   |Moves focus to the previous focusable element (can move focus out of the tree).|
| Arrow Down    |Moves focus to the next visible node.|
| Arrow Up      |Moves focus to the previous visible node.|
| Arrow Right   |On a collapsed, expandable node: expands it and keeps focus. On an expanded node: moves focus to its first child.|
| Arrow Left    |On an expanded node: collapses it and keeps focus. On a leaf node: moves focus to its parent.|
| Home          |Moves focus to the first visible node.|
| End           |Moves focus to the last visible node.|
| Enter / Space |Selects or toggles selection of the focused node.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Tree

<div class="ds-table-wrapper">

|Attribute|Value| Description                                                                 |
|-|-|-----------------------------------------------------------------------------|
|`aria-label`|string| Accessible name for the `sl-tree`.                                          |
|`aria-labelledby`|string| References (via id) a visible element that labels the tree (e.g. a heading).|

{.ds-table .ds-table-align-top}

</div>

### Tree node

<div class="ds-table-wrapper">

|Attribute|Value| Description                                                                              |
|-|-|------------------------------------------------------------------------------------------|
|`aria-label`|string| Accessible name for icon‑only buttons placed in `slot="actions"`.|

{.ds-table .ds-table-align-top}

</div>

</section>
