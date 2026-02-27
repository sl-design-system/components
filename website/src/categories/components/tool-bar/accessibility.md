---
title: Tool bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Tool bar
  key: ToolBarAccessibility
---
<section>

## Keyboard interactions

The tool bar supports full keyboard navigation using a roving tabindex pattern:

<div class="ds-table-wrapper">

|Command| Description                                                                   |
|-|-------------------------------------------------------------------------------|
|`Tab`| Moves focus into the tool bar (to the first focusable element) and out of it. |
|`Arrow Left` / `Arrow Right`| Moves focus between items in the tool bar.                                    |
|`Home`| Moves focus to the first item.                                                |
|`End`| Moves focus to the last item.                                                 |
|`Enter` or `Space`| Activates the focused button or opens a menu.                                 |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Input

<div class="ds-table-wrapper">

|Attribute|Value| Description                                                                                                                                    |
|-|-|------------------------------------------------------------------------------------------------------------------------------------------------|
|`aria-label`	|string| Defines a string that labels the tool bar (describes its purpose). This helps screen reader users understand what the group of actions is for. |
|`aria-labelledby`|string| Links the tool bar to an existing heading or element that describes it, instead of using `aria-label`. |

{.ds-table .ds-table-align-top}

</div>

</section>
