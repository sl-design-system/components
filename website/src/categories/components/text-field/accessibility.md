---
title: Text field accessibility
tags: accessibility
eleventyNavigation:
  parent: Text field
  key: TextInputAccessibility
---

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a text field:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|-|
|Space/Enter|-|
|Arrow Keys|-|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>


## WAI-ARIA
WAI-ARIA Roles, States, and Properties for a text field provide essential information to assistive technologies and screen readers. They convey the text field's role, state, and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.
<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it can be provided by the developer (yes)</sl-tooltip>

<div class="ds-table-wrapper">
  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`	|`'button'`|Makes it clear that our custom component is a button |no|
|`aria-labelledby`|string| When different element serves as the label, for example in the case of an icon-only button that has a label outside the button, this property can be set to the `id` of that element|yes|
|`aria-label`|string|To be used when the button is icon-only|yes|
|`aria-describedby`|string| When the button needs extra explanation or description you can reference this element here by the `id`. See [Note 2] below for more explanation| yes|
|`aria-disabled`| boolean| Announces the button as disabled with a screenreader. See [Note 3] below for more explanation| yes|
|`aria-pressed`| boolean | When the button is used as a toggle and is toggled on, the value of this state is true, and when toggled off, the state is false.| yes|

{.ds-table .ds-table-align-top}

</div>

</section>

    When `disabled` is added to a button there is no need to also add `aria-disabled`; Everything `aria-disabled` does, `disabled` does as well.

    You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)

</section>
