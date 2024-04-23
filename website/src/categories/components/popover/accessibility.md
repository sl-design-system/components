---
title: Popover accessibility
tags: accessibility
eleventyNavigation:
  parent: Popover
  key: PopoverAccessibility
---
<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a popover:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`Tab`|When the popover is opened, focus moves into the popover container to the first focusable element to navigate elements inside.|
|`Esc`|Closes the popover.|

{.ds-table .ds-table-align-top}

</div>

</section>
<section>

## Screen readers

The support for popovers differs in screen readers and other assistive technology. Therefore, it is essential to be critical when designing an interaction with a popover and only use it when there is genuinely no space in the main page. Alternatively, ensure that you provide additional accessibility support and thoroughly test it. When there is a lot going on in your popover, consider using a dialog instead.

When the popover contains plain text content (with no HTML markup), the element that triggers the popover—for example, a button—receives an aria-describedby attribute that points to the popover. This allows the screen reader to read out the text of the popover when the button is focused by the screen reader and the popover is opened. This approach is specifically for plain text because all the content of the popover gets concatenated into one string and is read as a single long piece of text without any way to interact with the content.

If you have a large piece of text in the popover, you can set the no-describedby attribute, and the connection won’t be made automatically. This way, the user can navigate to and from the description themselves.

Some screen readers have a functionality that lets the user “jump” to the element referred to by aria-details (which is set on all triggers and popovers automatically). Unfortunately, not all readers support this feature. Therefore, it’s crucial to always place the popover immediately after the element that triggers it. This ensures that it comes next in the page flow, allowing users to find it promptly.

</section>
<section>

## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a popover provide essential information to assistive technologies and screen readers. They convey the popovers's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">

|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`aria-expanded`|boolean|Set to `true` (on the anchor element) if the popover is visible, `false` if the popover is hidden.|no|
|`aria-details`|string|Used to link the popover element with the anchor (element that triggers the popover component). It contains `id` of the popover element and is added to the anchor element.|no|
|`aria-label`|string|Can be used to describe the popover content/purpose.|yes|
|`aria-labelledby`|string|Used to connect (by `id`) with single header/element inside a popover that describes the popover.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>
