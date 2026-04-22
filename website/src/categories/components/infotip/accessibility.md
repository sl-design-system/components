---
title: Infotip accessibility
tags: accessibility
eleventyNavigation:
  parent: Infotip
  key: InfotipAccessibility
---
<section>

## Accessibility considerations

### Keyboard accessibility
The infotip trigger is a button element, which is natively focusable. Keyboard users can reach the trigger via `Tab` and activate it with `Enter` or `Space` to open the popover. Pressing `Escape` closes the popover.

### Screen reader support
The trigger button has an accessible label of "More information" so screen reader users understand its purpose without needing to open it. The infotip content is linked to the associated form control via `aria-describedby`, so screen readers announce the content when the form control receives focus.

### Non-blocking behavior
The infotip popover is dismissible and does not block interaction with the rest of the page. Users can continue filling in the form without closing the infotip.

</section>

<section>

## Keyboard interactions

<div class="ds-table-wrapper">

| Command | Description |
|---------|-------------|
| `Tab` | Moves focus to the infotip trigger button. |
| `Enter` / `Space` | Opens or closes the infotip popover. |
| `Escape` | Closes the infotip popover. |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

The infotip trigger button uses `aria-label="More information"` to provide a meaningful accessible name. The infotip content is exposed to assistive technologies via `aria-describedby` on the associated form control's native input element, ensuring screen reader users hear the infotip content when focusing the input.

</section>
