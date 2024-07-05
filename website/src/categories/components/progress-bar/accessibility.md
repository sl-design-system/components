---
title: Progress bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Progress bar
  key: ProgressBarAccessibility
---

<section>

## Accessibility considerations

- Announcement of progress (for screen readers): Screen reader users should receive updates about the progress as it changes. This can be achieved by updating the aria-valuenow attribute and/or announcing changes in percentage or value through ARIA live regions (both are provided by the component).
- Error States and feedback: In case of error states, such as when the progress bar indicates an error condition, keyboard users should receive appropriate feedback. This can include announcing the error through ARIA live regions or focusing on an error indicator. By default, the component uses `aria-live="polite"` (to announce the status and progress change). However, in cases where there is an error, it can be useful to use `aria-live="assertive"`. In such situations, the aria-live attribute needs to be added to an element other than the progress bar itself. For example, it could be added to a field that is connected to the progress bar and may cause an error.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a progress bar provide essential information to assistive technologies and screen readers.  

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`	|`'progressbar'`|This role indicates that an element represents a progress bar. It is used for both determinate (where progress is measurable, like a percentage) and indeterminate (where progress is ongoing without specific measure) progress bars.|no|
|`aria-valuemin`|string|Specifies the minimum value of the progress bar - 0 (0%).|no|
|`aria-valuemax`|string|Specifies the maximum value of the progress bar - 100 (100%).|no|
|`aria-valuenow`|string|Indicates the current value/progress of the progress bar (as percentage). This attribute is updated dynamically as the progress changes. For example, if the progress is at 50%, aria-valuenow would be set to 50.| no|
|`aria-live`|`polite`|Announces the state and value update/changes.|no|
|`aria-busy`|boolean|Set to `true` when the progress bar is in the `indeterminate` state on the aria-live element, otherwise it's set to `false`.|no|
|`aria-labelledby`|string|Specifies a label or a reference to an element that serves as a label for the progress bar. This helps in associating the progress bar with its descriptive text or label for better understanding. By default, it contains `id` of the label (provided by `label` attribute). You can also connect the component with other label element using its `id` when there is no label attribute.|no/yes|
|`aria-describedby`|string|Identifies elements that provide additional descriptive information about the progress bar. This can include hints or additional explanations that assistive technologies can present to users. By default, it contains `id` of the slotted helper text.|no/yes|
|`aria-label`|string|Can be added, when the progress bar has no label attribute.|yes|

{.ds-table .ds-table-align-top}

</section>