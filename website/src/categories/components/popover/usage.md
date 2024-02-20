---
title: Popover usage
tags: usage
eleventyNavigation:
  parent: Popover
  key: PopoverUsage
---
<section>

## When to use

### Additional Information
When you want to provide more context or detailed information about an element. 

### Interactive Elements
Use popovers for actions or interactions related to an element. For example: a “More” button revealing additional actions for a task (e.g., edit, delete).

</section>

<section>

## When not to use

### Brief tips or hints
Avoid using popovers for brief tips or hints, use a [tooltip](/categories/components/tooltip/) instead. Popovers go beyond hints and can include detailed information. Popovers can be more verbose, with headers and multiple lines of text. They may even contain buttons or other interactive elements.

### Long content
If the popover content is too lengthy, it’s better to use a [dialog](/categories/components/dialog/) or a separate page. Popovers are meant for concise information.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Pointer	|Directs user’s attention to the source element that triggered the popover.|no|
|3|Container	|Area for text, images, links, and other content.|no|

{.ds-table}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the popover in Figma. They are available in the Design Panel so you can compose the popover to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Position|`1-o'clock` `2-o'clock` `3-o'clock` `4-o'clock` `5-o'clock` `6-o'clock` `7-o'clock` `8-o'clock` `9-o'clock` `10-o'clock` `11-o'clock` `12-o'clock`|To indicate the direction of context that the popover is attributed to |
|Container|`Slot component`| To select the content you want to show within the container |

{.ds-table}

</div>

</section>