---
title: Search field accessibility
tags: accessibility
eleventyNavigation:
  parent: Search field
  key: SearchFieldAccessibility
---

<section>

## Focusable clear button

The clear button is keyboard accessible when the search field contains a value. It gives keyboard and assistive-technology users a visible alternative to pressing the `Escape` key to clear the search term.

</section>

<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a search field:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab / Shift+Tab|Moves through the input, the Clear button when present, and the suggestion list when it contains suggestions. Shift+Tab reverses that order.|
|Enter in the input|Searches the typed words, including any explicitly accepted completion. An unaccepted suffix is excluded. The inherited form-submission behavior is preserved.|
|Right Arrow / End in the input|Accepts the proposed inline completion as editable text when the caret is at the end of the typed words.|
|Up Arrow / Down Arrow in the input|When suggestions are visible, moves focus to the last / first suggestion.|
|Up Arrow / Down Arrow in the list|Moves through the suggestions.|
|Home / End in the list|Moves to the first / last suggestion.|
|Enter in the list|Searches the focused phrase and returns focus to the input. It does not submit the surrounding form.|
|Escape in the input|Dismisses a visible inline proposal, suggestion list or suggestion status. If none is visible, clears the search value immediately.|
|Escape in the list|Closes suggestions and returns focus to the input without clearing the query.|
|Enter / Space on Clear|Clears the search field and moves focus back to the input.|
|Escape on Clear|Clears the search field and moves focus back to the input.|
|Backspace / Delete|Edits the typed text and selected ranges using normal input behavior. The visual inline suffix does not become part of the native input until accepted.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Autocomplete announcements and focus

Inline proposals are announced through a polite live region and added to the input's accessible description, including the Right Arrow / End acceptance instructions. Existing descriptions, such as a field hint, are preserved. Unaccepted proposals are excluded from the input value, form submission and native validation.

The input has the `searchbox` role. Suggestions use a separate, focusable listbox: its active option is identified with `aria-activedescendant`, while `aria-selected` reflects the current option. Updating suggestions preserves the active phrase when it remains available. If no options remain, focus returns to the input.

Loading, empty and unavailable messages describe suggestions, not the results of the search. They use a status region; searching with the typed words remains available. Keep the field's label and any persistent instructions meaningful without relying on placeholder text.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute | Value | Description |
|-|-|-|
|`aria-label`	|string|Defines a string that labels the action that will be performed when the user interacts with the search field. Needs to be added when the search-field is not wrapped with `sl-form-field` and there is no `sl-label`. |
|`aria-labelledby`|string|Used to connect with single header/element that describes the search field, when there is no label component connected to.|
|`aria-required`	|boolean|Informs the user that an element is required. When set to ‘true’, screen readers notify users that the element is required. |
|`aria-disabled`|boolean|Announces the search field component as disabled with a screen reader. See [Note 1] below.|
|`aria-autocomplete`|`none`, `inline`, `list`, `both`|Managed on the input to describe the configured suggestion mode.|
|`aria-controls`|ID reference|Managed on the input while the suggestion list is visible and contains options.|
|`aria-describedby`|ID references|Includes an inline proposal and acceptance instructions while a proposal is available, preserving existing descriptions.|

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the search field visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the search field out of the navigation flow.

When `disabled` is added to a search field there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>
