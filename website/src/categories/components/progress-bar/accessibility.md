---
title: Progress bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Progress bar
  key: ProgressBarAccessibility
---

<section>

## Accessibility considerations

- Announcement of progress (for screen readers): Screen reader users receive updates about the progress as it changes. The value is announced when it changes, but not more often than once every 1,5 seconds. When it reaches 100% it immediately reads it out, inclusing the current state (for example 'success' or 'error').
- Error States and feedback: In case of error states, such as when the progress bar indicates an error condition, keyboard users should receive appropriate feedback. Use for example an inline message, which uses the `announcer` to provide screen readers means to alert the user (using aria-live functionality) or make your own, custom, element using aria-live functionality. If the progressbar will never reach 100% because of the error let the screen reader user know what is happening and what they can do to remedy it by using a container with `aria-live` or use the `announcer` function.

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

|Attribute | Value | Description |
|-|-|-|
|`aria-busy`|boolean|Set internally to `true` when the progress bar is in the `indeterminate` state on the aria-live element, otherwise it's set to `false`. You can also set `aria-busy="true"` when you want to connect the progress bar with other element/region on your application (please remember to connect the element/region with the progress bar component by e.g. by `aria-describedby`).|
|`aria-labelledby`|string|Specifies a label or a reference to an element that serves as a label for the progress bar. This helps in associating the progress bar with its descriptive text or label for better understanding. By default, it contains `id` of the label (provided by `label` attribute). You can also connect the component with other label element using its `id` when there is no label attribute.|
|`aria-describedby`|string|Identifies elements that provide additional descriptive information about the progress bar. This can include hints or additional explanations that assistive technologies can present to users. By default, it contains `id` of the slotted helper text. You can also add `aria-describedby="progress-bar-id"` on other element of your application to connect it with the progress bar component.|
|`aria-label`|string|Can be added, when the progress bar has no label attribute.|

{.ds-table .ds-table-align-top}

</section>
