---
title: Segmented control accessibility
tags: accessibility
eleventyNavigation:
  parent: Segmented control
  key: SegmentedControlAccessibility
---

<section>

## Keyboard interactions

Use Tab to move focus into or out of the control. Focus enters on the selected option, or the first option if none is selected. Use the left and right arrow keys to move between options; navigation wraps. Press Space or Enter to activate the focused option.

<div class="ds-table-wrapper">

| Command | Description |
|---------|-------------|
| Tab | Moves focus into the segmented control (to the first element, or selected element when one exists) and out of it. |
| Arrow Left | Moves focus to the previous focusable element in the segmented control. |
| Arrow Right |	Moves focus to the next focusable element in the segmented control. |
| Home |	Moves focus to the first item. |
| End	| Moves focus to the last item. |
| Enter/Space |	Activates the focused item. |

{.ds-table .ds-table-align-top}

### Keyboard interactions when options do not fit the screen

When the options don’t fit in the available space, the segmented control switches to a select. Detailed information about keyboard interactions for that component can be found in <a href="/categories/components/select/accessibility/#keyboard-interactions" target="_blank"> the select documentation</a>.

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

The component sets `aria-current="true"` on the selected option and `aria-current="false"` on the other options. This state is managed automatically; you don’t need to set `aria-current` yourself.

<div class="ds-table-wrapper">

|Attribute|Value| Description                                                                          |
|-|-|--------------------------------------------------------------------------------------|
|`aria-label`|string| The `aria-label` can be added on the segmented control to describe its purpose. Individual button labels are provided with text. For icon only variants this text is not visible, but it's announced by screen readers. There is no need to add `aria-label` to buttons inside segmented control. |
|`aria-labelledby`|string| 	Use `aria-labelledby` to name the segmented control by referencing an existing element, rather than providing a label string with `aria-label`. |
|`aria-disabled`| boolean| Announces the segmented control item as disabled with a screen reader, prevents it from being selected and dims it while keeping it focusable. |

{.ds-table .ds-table-align-top}

</div>

</section>

