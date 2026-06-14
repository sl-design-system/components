---
title: Infotip
layout: docs
eleventyNavigation:
  key: Infotip
  parent: Utilities
---

`<sl-infotip>` is an info icon button that reveals additional information in a popover. Use it to
offer optional, supporting context next to a label or piece of content — without cluttering the
interface.

The content of the popover is slotted, so it can be plain text or richer markup.

## Usage

```html
<sl-infotip>This field requires a unique identifier used for account login.</sl-infotip>
```

## Examples

### Basic

Activate the icon button to toggle the popover.

```html {.example .show-source}
<sl-infotip>This field requires a unique identifier used for account login.</sl-infotip>
```

### Custom icon

Use the `icon` slot to replace the default info icon.

```html {.example .show-source}
<sl-infotip>
  <sl-icon name="far-circle-question" slot="icon"></sl-icon>
  You can change the trigger icon through the icon slot.
</sl-infotip>
```

### Rich content

The default slot accepts any markup, not just text.

```html {.example .show-source}
<sl-infotip>
  <strong>Password requirements</strong>
  <ul style="margin: 0.25rem 0 0; padding-inline-start: 1.25rem;">
    <li>At least 8 characters</li>
    <li>One uppercase letter</li>
    <li>One number or special character</li>
  </ul>
</sl-infotip>
```

### In a form label

The infotip is designed to be used in the `infotip` slot of `<sl-label>`, so it sits neatly next to
the label text of a form field.

```html
<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip">A unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field placeholder="Username"></sl-text-field>
</sl-form-field>
```

## API

`<sl-infotip>` exposes a default slot for the popover content and an `icon` slot for the trigger
icon. See the [source on GitHub](https://github.com/sl-design-system/components/tree/main/packages/components/infotip)
for the full API.
