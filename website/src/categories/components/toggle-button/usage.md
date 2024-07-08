---
title: Toggle button usage
tags: usage
eleventyNavigation:
  parent: Toggle button
  key: ToggleButtonUsage
---

<section class="no-heading">

<div class="ds-example">
  TODO: example
</div>

<div class="ds-code">

  ```html
    TODO: example
  ```

</div>

</section>

<section>

## When to use

### Familiar Actions and UI Element Toggles
Icon-only toggle buttons are ideal for actions that are easily recognizable by users through common icons, such as play/pause, like/unlike, or expand/collapse. These buttons are commonly used in toolbars and media controls where space is limited and quick access to functionalities like muting audio or changing playback states is necessary. They are also useful for toggling UI elements on or off, such as expanding or collapsing a drawer, showing or hiding a menu, or turning a feature on or off within the application interface.

</section>

<section>

## When not to use

### Toggling Features or Settings
In forms or settings panels, it's important to meet user expectations for consistency and clarity. Users typically expect to see switches when enabling or disabling features. If you use an icon-only button instead, it can confuse users and disrupt the uniformity of the interface. So, in these situations, always opt for a [switch](/categories/components/switch/) component. It provides a clear, intuitive way for users to understand the state of a feature.

</section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Name|Description|yes/no|
|1|Name|Description|yes/no|
|1|Name|Description|yes/no|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options

With these options, you can tweak the appearance of the toggle button in Figma. They are available in the Design Panel so you can compose the switch to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Sizes|`sm` `md` `lg`|The switch come in three sizes: small, medium (default) and large. |
|Orientation |`left` `right`|The switch has 2 different lay-out possibilities relating to the positions of the label and switch relative to each other.|
|Disabled|`boolean`|To indicate if the switch is enabled or disabled|
|Label|`value`|To insert the text of the label|
|Status|`boolean`|To indicate if the switch is checked or unchecked|
|State|`default` `hover` `active` `disabled` |To indicate the state of the switch|
|Icon|`boolean`|To show an icon in the handle of the switch|
|Focus ring|`boolean`|To show the focus state of the switch|

{.ds-table .ds-table-align-top}

</div>

</section>
