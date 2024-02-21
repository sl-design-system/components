---
title: Popover usage
tags: usage
eleventyNavigation:
  parent: Popover
  key: PopoverUsage
---
<style>
.ds-example header {
  margin-block: var(--scale-100-scale);
  display: flex;
  justify-content: space-between;
}

#example-content {
  display: grid;
  gap: 0.4rem;
  grid-template-columns: 1fr 1fr;
}

#example-content p {
  margin-block: 0;
}
</style>

<section class="no-heading">

<div class="ds-example">
  <sl-button id="anchor" popovertarget="popover-1" variant="primary">Show more information</sl-button>
  <sl-popover id="popover-1" anchor="anchor" aria-label="More information about John">
  <header class="ds-heading-3">
  Project Overview
  <sl-button id="close-btn" fill="ghost" variant="default" size="sm" aria-label="Close the popover" autofocus>
  <sl-icon name="xmark"></sl-icon>
  </sl-button>
  </header>
  <hr color="#D9D9D9" />
  <div id="example-content">
    <p>Assigned to</p> <p>John Smith</p>
    <p>Class</p> <p>2a</p>
    <p>Due</p> <p>March 10, 2024</p>
  </div>
  </sl-popover>
</div>

<div class="ds-code">

  ```html
<sl-button id="anchor" popovertarget="popover-1">Show more information</sl-button>
<sl-popover id="popover-1" anchor="anchor" aria-label="More information about John">
    <header>Project Overview <sl-button autofocus>...</sl-button></header>
    <hr>
    <section>
      Assigned to...
    </section>
</sl-popover>
  ```

</div>
</section>

<section>

## When to use

### Additional Information
When you want to provide more context or detailed information about an element. 

### Interactive Elements
Use popovers for actions or interactions related to an element. For instance, a scenario where a user hovers over an image thumbnail. A popover could appear, displaying additional details about the image, such as its title, description, and tags.

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

<script>
const popoverBtn = document.querySelector("#anchor");
const popoverExample = document.querySelector("#popover-1");
const closeBtn = document.querySelector("#close-btn");

requestAnimationFrame(() => {
popoverBtn.addEventListener("click", () => {
    if (popoverExample) {
      popoverExample.togglePopover();
    }
  });

closeBtn.addEventListener("click", () => {
    if (popoverExample) {
      popoverExample.hidePopover();
    }
  });
})
</script>