---
title: Tooltip usage
tags: usage
eleventyNavigation:
  parent: Tooltip
  key: TooltipUsage
---
<section class="no-heading">
<div class="ds-example">

<sl-button aria-describedby="tooltip" fill="solid" variant="primary">Button with a tooltip</sl-button>
<sl-tooltip id="tooltip">This is a tooltip with some additional information</sl-tooltip>

</div>

<div class="ds-code">

  ```html
<sl-button aria-describedby="tooltip">Button with a tooltip</sl-button>
<sl-tooltip id="tooltip">This is a tooltip with some additional information</sl-tooltip>
  ```

</div>
</section>

<section>

## When to use

### Explanations for unfamiliar terms or jargon
Tooltips can offer brief definitions or explanations for technical terms, acronyms, or industry-specific terminology.

### Long titles or descriptions
If you’re displaying a list of articles with truncated titles, a tooltip can reveal the complete title when users hover over the ellipsis.
</section>

<section>

## When not to use

### Essential and critical information
Avoid using tooltips for critical instructions or essential information. Users may miss tooltips, especially if they quickly interact with elements.

### Mobile devices and touchscreens
Tooltips rely on hover interactions, which do not translate well to touchscreens.

### Accessibility concerns
Some users rely on screen readers or have visual impairments. Ensure that tooltips are accessible and provide an alternative method (such as keyboard shortcuts) to access the same information.
  
</section>

<section>

## Anatomy

<div class="ds-table-wrapper">
  
|Item|Name| Description | Optional|
|-|-|-|-|
|1|Panel	|Contains the panel content|no|
|2|Content	|An area to display any text content|no|
|3|Pointer	|Indicates the direction of context that the tooltip is attributed to|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Options

With these options you can tweak the appearance of the tooltip in Figma. They are available in the Design Panel so you can compose the tooltip to exactly fit the user experience need for the uses case you are working on.

<div class="ds-table-wrapper">
  
|Item|Options|Description|
|-|-|-|
|position|`1-o'clock` `2-o'clock` `3-o'clock` `4-o'clock` `5-o'clock` `6-o'clock` `7-o'clock` `8-o'clock` `9-o'clock` `10-o'clock` `11-o'clock` `12-o'clock`|To indicate the direction of context that the tooltip is attributed to|
|tooltip|`value`|To insert the text of the tooltip|

{.ds-table .ds-table-align-top}

</div>

</section>
