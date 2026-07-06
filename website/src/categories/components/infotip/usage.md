---
title: Infotip usage
tags: usage
eleventyNavigation:
  parent: Infotip
  key: InfotipUsage
---
<section class="no-heading">
<div class="ds-example">

<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip" size="sm">This field requires a unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field placeholder="Username"></sl-text-field>
</sl-form-field>

</div>

<div class="ds-code">

  ```html
<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip" size="sm">This field requires a unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field placeholder="Username"></sl-text-field>
</sl-form-field>
  ```

</div>
</section>

<section>

## Basic usage

The infotip is designed to be used inside the `infotip` slot of `<sl-label>`. This ensures it is correctly
positioned next to the label and semantically linked to the associated form control.

<div class="ds-code">

```html
<sl-label>
  Label text
  <sl-infotip slot="infotip">This is additional information.</sl-infotip>
</sl-label>
```

</div>

</section>

<section>

## Custom icon

By default the infotip renders a `circle-info` icon. You can replace this with any icon by slotting it into the `icon` slot.

<div class="ds-example">

<sl-infotip>
  <sl-icon name="clock" slot="icon"></sl-icon>
  Don't forget to watch the time.
</sl-infotip>

</div>

<div class="ds-code">

  ```html
<sl-infotip>
  <sl-icon name="clock" slot="icon"></sl-icon>
  Don't forget to watch the time.
</sl-infotip>
  ```

</div>

</section>

<section>

## Rich content

The default slot accepts any HTML content, allowing you to use rich markup such as emphasis, lists, or links.

<div class="ds-example">

<sl-infotip>
  <strong>Password requirements</strong>
  <ul style="margin: 0.25rem 0 0; padding-inline-start: 1.25rem;">
    <li>At least 8 characters</li>
    <li>One uppercase letter</li>
    <li>One number or special character</li>
  </ul>
</sl-infotip>

</div>

<div class="ds-code">

  ```html
<sl-infotip>
  <strong>Password requirements</strong>
  <ul>
    <li>At least 8 characters</li>
    <li>One uppercase letter</li>
    <li>One number or special character</li>
  </ul>
</sl-infotip>
  ```

</div>

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional |
|------|------|-------------|----------|
| 1 | Trigger button | An icon button that opens and closes the popover. | No |
| 2 | Icon | The icon displayed in the trigger button. Defaults to `circle-info`. | No |
| 3 | Popover | The overlay container that displays the infotip content. | No |
| 4 | Content | The text or rich content shown inside the popover. | No |

{.ds-table .ds-table-align-top}

</div>

</section>
