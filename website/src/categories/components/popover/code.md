---
title: Popover code
tags: code
APIdescription: The popover component offers settings for various scenarios.
eleventyNavigation:
  parent: Popover
  key: PopoverCode
---
<section class="no-heading">

<div class="ds-example">
<sl-button id="my-btn" popovertarget="popover-2" fill="outline" variant="primary">More details about the student</sl-button>
<sl-popover id="popover-2" anchor="my-btn">
<header class="ds-heading-3">John Smith</header>
<hr color="#D9D9D9" />
<section id="example-content">
  <p><sl-icon slot="icon" name="fas-school" size="xl"></sl-icon></p> <p>Da Vinci International School</p>
  <p><sl-icon slot="icon" name="star" size="xl"></sl-icon></p> <p>Class 2a</p>
  <p><sl-icon slot="icon" name="fas-envelope" size="xl"></sl-icon></p> <p>john.smith@primaryschool.org</p>
</section>
</sl-popover>
</div>

<div class="ds-code">

  ```html
<sl-button id="my-btn" popovertarget="popover-2">Show more information</sl-button>
<sl-popover id="popover-2" anchor="my-btn">
  <header>Project Overview</header>
  <hr>
  <section>
    Assigned to...
  </section>
</sl-popover>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<script>
const myPopoverBtn = document.querySelector("#my-btn");
const popoverCodeExample = document.querySelector("#popover-2");

requestAnimationFrame(() => {
console.log('myPopoverBtn, popoverCodeExample', myPopoverBtn, popoverCodeExample);
myPopoverBtn?.addEventListener("click", () => {
    if (popoverCodeExample) {
      popoverCodeExample.togglePopover();
    }
  })
})
</script>