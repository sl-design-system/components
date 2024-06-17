---
title: Badge usage
tags: usage
eleventyNavigation:
  parent: Badge
  key: BadgeUsage
---
<section>
<div class="ds-example" style="gap: 3rem;">
<sl-badge emphasis="bold" size="sm" variant="danger"></sl-badge>
<sl-badge><sl-icon name="check"></sl-icon></sl-badge>
<sl-badge>99+</sl-badge>
<sl-badge size="lg" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
<sl-badge size="lg" variant="success">English teacher</sl-badge>
</div>

<div class="ds-code">

  ```html
    <sl-badge emphasis="bold" size="sm" variant="danger"></sl-badge>
    <sl-badge><sl-icon name="check"></sl-icon></sl-badge>
    <sl-badge>99+</sl-badge>
    <sl-badge size="lg" variant="info"><sl-icon name="face-smile"></sl-icon>Student</sl-badge>
    <sl-badge size="lg" variant="success">English teacher</sl-badge>
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

### Don't use the small size
The small size of the badge is only meant to be used in combination with the avatar component. Do not use it for other purposes.

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

## Emphasis
Understanding when to use subtle and bold emphasis for badge components is crucial for effective user interface design. Badges serve as visual cues to convey various types of information, ranging from minor details to critical alerts.

<section class="ds-cards">
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-badge size="lg" variant="accent">Subtle</sl-badge>
    </div>
    <figcaption>

### Subtle (default)
Use subtle emphasis when the information conveyed by the badge is important but not critical. This could include supplementary details, status indicators, or minor distinctions.

    </figcaption>
  </figure>
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-badge emphasis="bold" size="lg" variant="accent">Bold</sl-badge>
    </div>
    <figcaption>

### Bold
Reserve bold emphasis for situations where the information conveyed by the badge is crucial or demands immediate attention. This could include urgent notifications, critical alerts, or high-priority indicators.

    </figcaption>
  </figure>
</section>

</section>

<section>

## Figma Options

With these options, you can tweak the appearance of the badge in Figma. They are available in the Design Panel so you can compose the badge to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`sm` `md` `lg`|Indicates the size of the badge|
|Emphasis|`subtle` `bold`|Indicates the emphasis the badge should have, with subtle being the default.|
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
