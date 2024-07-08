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
|1|Container|THTML button  element 	|no|
|2|Icon|The outline icon appears in the default state, while the filled icon is displayed when the toggle button is selected|no|
|3|Tooltip|The tooltip appears on hover to provide additional information about the toggle button's action|no|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options

With these options, you can tweak the appearance of the toggle button in Figma. They are available in the Design Panel so you can compose the switch to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Type|`outline` `ghost`|To indicate the type of the toggle button |
|State |`idle` `hover` `active` `Disabled`|To indicate the state of the toggle button|
|Size|`sm` `md` `lg`|To determine the size of the toggle button|
|Selected|`boolean`|To indicate whether the toggle is selected or not|
|FontAwesome|`value`|To specify the name of the Font Awesome icon you wish to use in the toggle button.|


{.ds-table .ds-table-align-top}

</div>

</section>
