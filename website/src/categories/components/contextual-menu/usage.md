---
title: Contextual menu usage
tags: usage
eleventyNavigation:
  parent: Contextual menu
  key: ContextualMenuUsage
---

<section class="no-heading">

<div class="ds-example" style="gap: 4rem;">

<sl-menu-button position="bottom">
  <span slot="button">Actions</span>
  <sl-menu-item><sl-icon name="smile"></sl-icon>Profile</sl-menu-item>
  <sl-menu-item><sl-icon name="far-gear"></sl-icon>Settings</sl-menu-item>
  <sl-menu-item><sl-icon name="far-trash"></sl-icon>Remove</sl-menu-item>
</sl-menu-button>

<sl-menu-button position="bottom-end" aria-label="Show more options">
  <sl-icon name="ellipsis" slot="button"></sl-icon>
  <sl-menu-item>Update</sl-menu-item>
  <sl-menu-item>Remove</sl-menu-item>
</sl-menu-button>

</div>

<div class="ds-code">

  ```html
  <sl-menu-button>
    <span slot="button">Actions</span>
    <sl-menu-item>
      <sl-icon name="smile"></sl-icon>
      Profile
    </sl-menu-item>
    <sl-menu-item>
      <sl-icon name="far-gear"></sl-icon>
      Settings
    </sl-menu-item>
    <sl-menu-item>
      <sl-icon name="far-trash"></sl-icon>
      Remove
    </sl-menu-item>
  </sl-menu-button>
  
  <sl-menu-button aria-label="Show more options">
    <sl-icon name="ellipsis" slot="button"></sl-icon>
    <sl-menu-item>Update</sl-menu-item>
    <sl-menu-item>Remove</sl-menu-item>
  </sl-menu-button>
  ```

</div>

</section>

<section>

## When to use

...

</section>

<section>

## When not to use

...

</section>


<section>

## Options

...

</section>