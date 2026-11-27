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
|Backspace / Delete|Edits the typed text and selected ranges using normal input behavior. Deleting text hides the inline proposal while the suggestion list continues to update.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Autocomplete announcements and focus

- **Inline proposals** are announced through `sl-announcer`, so make sure `<sl-announcer>` is present in your application. The proposal and how to accept it are also added to the input's accessible description, next to existing descriptions such as a hint. Proposals that are not accepted are excluded from the value, form submission and validation.
- **Suggestion modes** are exposed on the input with `aria-autocomplete`. While the suggestion list is visible, the input refers to it with `aria-controls`.
- **The suggestion list** is a separate, focusable listbox. The active option is identified with `aria-activedescendant`. Moving through the list with the arrow keys does not select a phrase or change the query. `aria-selected` is only `true` for the option that exactly matches the text in the field.
- **Updating suggestions** keeps the active phrase when it is still available. If no options remain, focus returns to the input.
- **Loading, empty and unavailable messages** are about suggestions, not about the search results, and use a status region. Searching the typed words stays available.

Keep the field's label and any instructions meaningful without relying on placeholder text.

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

{.ds-table .ds-table-align-top}

</div>

**Notes:**
1. The `aria-disabled` should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities:

- `disabled` dims the search field visually, takes it out of the tab-focus sequence, prevents actions (click, enter) on it and announces it as 'dimmed' or 'disabled' in a screen reader.

- `aria-disabled` only does the latter. You will need to disable the functionality yourself. This might be useful for scenarios where you don't want to take the search field out of the navigation flow.

When `disabled` is added to a search field there is no need to also add `aria-disabled`. Everything `aria-disabled` does, `disabled` does as well. You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

</section>
