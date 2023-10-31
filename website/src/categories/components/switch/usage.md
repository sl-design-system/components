---
title: Switch usage
tags: usage
eleventyNavigation:
  parent: Switch
  key: SwitchUsage
---
<section>

<div class="ds-example">
<sl-switch size="md" checked>switch text</sl-switch>
</div>

<div class="ds-code">

```html

<sl-switch size="md" checked>switch text</sl-switch>

```

</div>
</section>

<section>

## When to use
A switch component is best used when:

- **Binary Settings**
When you have straightforward on/off options that users should be able to control effortlessly, switches are the ideal choice. They offer a simple and intuitive way to switch between two states.

- **Instant Feedback**
Ensure users receive immediate, clear visual feedback regarding the status of a setting. Changes are instantly visible when a switch is toggled.


</section>

<section>

## When not to use

- **Complex Settings**
If your setting has multiple states or requires more than a simple on/off toggle, switches may not be suitable. Consider alternative components like checkboxes, dropdown menus, or sliders that can accommodate more options and nuances in such cases.

</section>

<section>

## Anatomy

```
  visual
```

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Handle	|Transforms between selected and unselected states as the user navigates to its preference.|no|
|2|On/off icon	|A visual cue is placed within the track to indicate that the switch is 'on' or 'off'.	|yes|
|3|Slider track	|The background area serves as the pathway for the switch handle's movement. |no|
|4|Label	|Describes the purpose and context of the switch component. |yes|
|5|Help text/hint	|The help text offers guidance, it explains to the user what happens when turning the option on or off. |yes|

{.ds-table}

...

</section>

<section>

## Options

The switch provides a set of options, ensuring it's ready to adapt to your unique use cases.

```
  visual
```

|Item|Options|Description|
|-|-|-|
|Sizes|`'small', 'medium', 'large'`|...|
|Status |`...`|...|
|State|`...`|...|
|Icon|`...`|...|

{.ds-table .ds-table-align-top}

...

</section>

<section>

## Behavior

### Switching States: Checked and Unchecked
Get ready to take control! Switches offer two distinct states: 'checked' and 'unchecked.' In the 'checked' state, the handle confidently rests on the right, while in the 'unchecked' state, it gracefully takes its place on the left.

### Understanding The Clickable Areas
Let's take a closer look at the clickable area for the switch input, often referred to as the 'hit area' or 'touch target area.' This area dynamically adjusts its size to match the dimensions of the switch, ensuring precise touch interactions. And don't forget, the associated label is equally clickable, adding to the user-friendly experience.

### Focusable Switch Area
Both the switch input and label are interactive, allowing users to hover over them. However, when it comes to focus via keyboard or voice commands, only the switch thumb takes center stage.

</section>