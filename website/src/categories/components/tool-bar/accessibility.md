---
title: Tool bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Tool bar
  key: ToolBarAccessibility
---
<section>

## Keyboard interactions

<div class="ds-table-wrapper">

| Command     | Description                                                                   |
|-------------|-------------------------------------------------------------------------------|
| Tab         | Moves focus into the tool bar (to the first focusable element) and out of it. |
| Arrow Left  | Moves focus to the previous focusable element in the tool bar.                |
| Arrow Right | Moves focus to the next focusable element in the tool bar.                    |
| Home        | Moves focus to the first item.                                                |
| End         | Moves focus to the last item.                                                 |
| Enter/Space | Activates the focused button or opens a menu.                         |

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
