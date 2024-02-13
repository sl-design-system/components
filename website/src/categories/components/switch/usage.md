---
title: Switch usage
tags: usage
eleventyNavigation:
  parent: Switch
  key: SwitchUsage
---
<section>

<div class="ds-example">
<sl-switch size="md" checked hint="Switch helper text">switch text</sl-switch>
</div>

<div class="ds-code">

```html

<sl-switch size="md" checked hint="Switch helper text">switch text</sl-switch>

```

</div>
</section>

<section>

## When to use
A switch component is best used when:

### Binary Settings
When you have straightforward on/off options that users should be able to control effortlessly, switches are the ideal choice. They offer a simple and intuitive way to switch between two states.

### Instant Feedback
Ensure users receive immediate, clear visual feedback regarding the status of a setting. Changes are instantly visible when a switch is toggled.

</section>

<section>

## When not to use

### Complex Settings
If your setting has multiple states or requires more than a simple on/off toggle, switches may not be suitable. Consider alternative components like checkboxes, dropdown menus, or sliders that can accommodate more options and nuances in such cases.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Handle	|Transforms between selected and unselected states as the user navigates to its preference.|no|
|2|On/off icon	|A visual cue is placed within the track to indicate that the switch is 'on' or 'off'.	|yes|
|3|Slider track	|The background area serves as the pathway for the switch handle's movement. |no|
|4|Label	|Describes the purpose and context of the switch component. |yes|
|5|Help text/hint	|The help text offers guidance, it explains to the user what happens when turning the option on or off. |yes|

{.ds-table}

</div>

</section>

<section>

## Options

The switch provides a set of options, ensuring it's ready to adapt to your unique use cases.

<div class="ds-table-wrapper">
  
### Switch

|Item|Options|Description|
|-|-|-|
|Sizes|`sm` `md` `lg`|The switch come in three sizes: small, medium (default) and large. |
|Orientation |`left` `right` `vertical`|The switch has 3 different lay-out possibilities, providing flexibility to align with your design requirements.|
|Disabled|`unchecked` `checked`|To indicate if the switch is active or disabled|
|Label|`value`|To insert the text of the label|
|Status|`unchecked` `checked`|To indicate if the switch is checked or unchecked|
|State|`default` `hover` `active` `disabled` |To indicate the state of the switch|
|Icon|`unchecked` `checked`|To show an icon in the handler of the switch|
|Focus ring|`unchecked` `unchecked`|To show the focus state of the switch|

{.ds-table .ds-table-align-top}

</div>

<div class="ds-table-wrapper">
  
### Hint

|Item|Options|Description|
|-|-|-|
|Hint|`unchecked` `checked`|To show a hint|
|State|`default` `invalid` `disable`|To indicate the state of the hint|
|Size|`sm` `md` `lg`|The hint come in three sizes: small, medium (default) and large.|
|Text|`value`|To insert the text of the hint|


{.ds-table .ds-table-align-top}

</div>

</section>
