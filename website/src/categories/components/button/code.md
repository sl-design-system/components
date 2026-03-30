---
title: Button code
tags: code
packageName: button
APIdescription: The SL Design System button can be used to replace the default HTML button. We've tried our best to mimic all the behaviours and options you get when using a standard button. But this one looks a lot nicer!
eleventyNavigation:
  parent: Button
  key: ButtonCode
---
<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button fill="solid" size="md">Default</sl-button>
    <sl-button fill="solid" size="md" variant="primary">Primary</sl-button>
    <sl-button fill="solid" size="md" variant="success">Success</sl-button>
    <sl-button fill="solid" size="md" variant="warning">Warning</sl-button>
    <sl-button fill="solid" size="md" variant="danger">Danger</sl-button>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-button fill="solid" size="md">Default</sl-button>
  <sl-button fill="solid" size="md" variant="primary">Primary</sl-button>
  <sl-button fill="solid" size="md" variant="success">Success</sl-button>
  <sl-button fill="solid" size="md" variant="warning">Warning</sl-button>
  <sl-button fill="solid" size="md" variant="danger">Danger</sl-button>
  ```

</div>
</section>

<ds-install-info link-in-navigation package="button"></ds-install-info>

<section>

## Commands

The `<sl-button>` component supports the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API). This allows you to declaratively connect a button to another element and invoke a command on it, without needing any JavaScript.

Use the `command` attribute to specify the command to invoke, and the `commandfor` attribute to reference the `id` of the target element.

For example, you can open and close an `<sl-dialog>` using the `--show-modal` and `--close` commands:

<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button command="--show-modal" commandfor="invoker-dialog" variant="primary">Open dialog</sl-button>
    <sl-dialog id="invoker-dialog">
      <h1 slot="title">Dialog opened with Invoker Commands API</h1>
      <p>This dialog was opened using the Invoker Commands API. No JavaScript needed!</p>
      <sl-button command="--close" commandfor="invoker-dialog" slot="primary-actions">Close</sl-button>
    </sl-dialog>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-button command="--show-modal" commandfor="my-dialog" variant="primary">Open dialog</sl-button>
  <sl-dialog id="my-dialog">
    <h1 slot="title">Dialog opened with Invoker Commands API</h1>
    <p>This dialog was opened using the Invoker Commands API. No JavaScript needed!</p>
    <sl-button command="--close" commandfor="my-dialog" slot="primary-actions">Close</sl-button>
  </sl-dialog>
  ```

</div>
</section>

{% include "../component-table.njk" %}

