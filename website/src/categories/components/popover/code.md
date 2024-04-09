---
title: Popover code
tags: code
APIdescription: The popover component offers settings for various scenarios.
eleventyNavigation:
  parent: Popover
  key: PopoverCode
---
<style>
#code-example {
  display: flex;
  flex-direction: column;
}

#code-example p {
  display: inline-flex;
  font-size: 1.4rem;
  gap: 1.6rem;
  margin-block: 0.8rem;
}
</style>

<section class="no-heading">

<div class="ds-example">
  <sl-button id="my-btn" popovertarget="popover-2" fill="outline" variant="primary">More details about the student</sl-button>
  <sl-popover id="popover-2" anchor="my-btn" position="bottom-start" aria-label="Information about the student - John Smith">
  <header class="ds-heading-3" style="align-items: start;">
  <sl-avatar display-name="John Smith" size="2xl">Primary school</sl-avatar>
  <sl-button id="close-popover-btn" fill="ghost" variant="default" size="sm" aria-label="Close the popover" autofocus>
  <sl-icon name="xmark"></sl-icon>
  </sl-button>
  </header>
  <hr color="#D9D9D9" />
  <div id="code-example">
    <p><sl-icon slot="icon" name="fas-school" size="lg"></sl-icon>Da Vinci International School</p>
    <p><sl-icon slot="icon" name="fas-screen-users" size="lg"></sl-icon>Class 2a</p>
    <p><sl-icon slot="icon" name="fas-envelope" size="lg"></sl-icon>john.smith@primaryschool.org</p>
  </div>
  </sl-popover>
</div>

<div class="ds-code">

  ```html
<sl-button id="my-btn" popovertarget="popover-2">More details...</sl-button>

<sl-popover id="popover-2" anchor="my-btn" position="bottom-start" aria-label="Information about the student...">
    <header>
      <sl-avatar display-name="John Smith">Primary school</sl-avatar>
      <sl-button aria-label="Close the popover" autofocus>
        <sl-icon name="xmark"></sl-icon>
      </sl-button>
    </header>
    <hr>
    <section>
      Da Vinci...
    </section>
</sl-popover>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="popover"></ds-install-info>
<section>

## Opening / closing

The `sl-popover` component uses `'popover'` attribute and can be shown/hidden using native Popover API methods like:

<div class="ds-table-wrapper">

|Name| Description |
|-|-|
|`hidePopover()`|Hides a popover element by removing it from the top layer and styling it with display: none.|
|`showPopover()`|Shows a popover element by adding it to the top layer.|
|`togglePopover()`|Toggles a popover element between the showing and hidden states.|

{.ds-table}

</div>

More information you can find [on the MDN page about the Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API).

</section>

{% include "../component-table.njk" %}

<script>
const myPopoverBtn = document.querySelector("#my-btn");
const popoverCodeExample = document.querySelector("#popover-2");
const closePopoverBtn = document.querySelector("#close-popover-btn");

requestAnimationFrame(() => {
myPopoverBtn?.addEventListener("click", () => {
    if (popoverCodeExample) {
      popoverCodeExample.togglePopover();
    }
  });

closePopoverBtn.addEventListener("click", () => {
    if (popoverCodeExample) {
      popoverCodeExample.hidePopover();
    }
  });
})
</script>
