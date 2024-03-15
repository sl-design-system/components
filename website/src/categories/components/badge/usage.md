---
title: Badge usage
tags: usage
eleventyNavigation:
  parent: Badge
  key: BadgeUsage
---
<section>  
<div class="ds-example" style="gap: 3rem;">
<sl-badge>99+</sl-badge>
<sl-badge size="sm" variant="danger"></sl-badge>
<sl-badge size="3xl" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="2xl" variant="success">English teacher</sl-badge>
</div>

<div class="ds-code">

  ```html
    <sl-badge>99+</sl-badge>
    <sl-badge size="sm" variant="danger"></sl-badge>
    <sl-badge size="3xl" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
    <sl-badge size="2xl" variant="success">English teacher</sl-badge>
  ```
</div>

</section>

<section>

## When to use

### Use Badges to Draw Attention
Badges are an effective way to highlight new notifications, important content, or status changes that may be of particular interest to users. By adding badges, you can instantly grab attention and encourage users to explore further.

</section>

<section>

## When not to use

### Don't use badges as a interactive status indicators
Badges serve as visual cues to convey information without requiring user interaction. 

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|The badge container|no|
|2|Icon	|Icon that can be positioned before the label.|yes|
|3|Label	|The label is the text attributed to the badge that provides context.|yes|

{.ds-table}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the badge in Figma. They are available in the Design Panel so you can compose the badge to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">
  
|Item|Options|Description|
|-|-|-|
|Size|`sm` `md` `lg` `xl` `2xl` `3xl`|Description|
|Variant|`primary` `accent` `neutral` `success` `info` `warning` `danger`|The badge offers seven distinct intents, each conveying a unique tone to the user.|
|Show label|`boolean`|The option to turn the label on or off|
|Label|`option`|Displays the text of the label|
|Show icon|`boolean`|The option to turn the icon on or off|
|Icon type|`fa` `svg`|Choose between a FontAwesome icon or a custom SVG.|
|FontAwesome|`value`|To insert the name of the icon.|
|SVG Instance|`instance`|To select the instance of the SVG.|

{.ds-table}
</div>

</section>
