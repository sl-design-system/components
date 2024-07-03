---
title: Progress bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Progress bar
  key: ProgressBarAccessibility
---

<section>

## Accessibility considerations

- Tab: Users are be able to navigate to the progress bar using the Tab key.
- Focus: When the progress bar receives focus the focus ring should be visible.
- Announcement of progress (for screen readers): Screen reader users should receive updates about the progress as it changes. This can be achieved by updating the aria-valuenow attribute (if applicable) or announcing changes in percentage or value through ARIA live regions.
- Error States and feedback: In case of error states, such as when the progress bar indicates an error condition, keyboard users should receive appropriate feedback. This can include announcing the error through ARIA live regions or focusing on an error indicator.

</section>

<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for a progress bar provide essential information to assistive technologies and screen readers.  

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`	|`'progressbar'`|This role indicates that an element represents a progress bar. It is used for both determinate (where progress is measurable, like a percentage) and indeterminate (where progress is ongoing without specific measure) progress bars. |no|
|`aria-valuemin`|string|Specifies the minimum value of the progress bar. For example, this might be 0% or 0 seconds, depending on the context of what the progress bar measures.|yes|
|`aria-valuemax`|string|Specifies the maximum value of the progress bar. This represents the endpoint of the progress. For instance, 100% or a specific time duration.|yes|
|`aria-valuenow`|string|Indicates the current value or progress of the progress bar. This attribute is updated dynamically as the progress changes. For example, if the progress is at 50%, aria-valuenow would be set to 50.| yes|
|`aria-valuetext`|string|Provides an alternative human-readable text for aria-valuenow. This is used to provide more descriptive or contextual information about the progress to users of assistive technologies.| yes|
|`aria-labelledby`|string|Specifies a label or a reference to an element that serves as a label for the progress bar. This helps in associating the progress bar with its descriptive text or label for better understanding.|yes|
|`aria-describedby`|string|Identifies elements that provide additional descriptive information about the progress bar. This can include hints or additional explanations that assistive technologies can present to users.|yes|

{.ds-table .ds-table-align-top}

