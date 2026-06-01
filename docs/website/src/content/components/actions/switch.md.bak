---
title: Switch
layout: component
issueNumber: 2315
storybook: form-switch--basic
eleventyNavigation:
  key: Switch
  parent: Actions
---

```html {.example .show-source}
<sl-switch>Dark mode</sl-switch>
```

## Usage

Use a switch when users need to toggle a binary setting on or off with immediate effect — no form submission required. Common examples include enabling notifications, activating dark mode, or toggling a feature preference.

::: info
A switch should always take effect immediately. If the action requires confirmation or a form submit, use a checkbox instead.
:::

Avoid using switches for contextual UI controls like opening drawers, menus, or panels. In those cases, use a [toggle button](/components/actions/toggle-button/) instead.

## Examples

### Checked

Use the `checked` attribute to set the initial on state, or bind to it to control the state programmatically.

```html {.example .horizontal}
<sl-switch>Unchecked</sl-switch>
<sl-switch checked>Checked</sl-switch>
```

### Size

Switches are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent settings

```html {.example .horizontal}
<sl-switch size="sm">Small</sl-switch>
<sl-switch size="md">Medium</sl-switch>
<sl-switch size="lg">Large</sl-switch>
```

### Reverse

Use the `reverse` attribute to place the toggle after the label instead of before it.

```html {.example .horizontal}
<sl-switch>Label before</sl-switch>
<sl-switch reverse>Label after</sl-switch>
```

### Custom icons

Use the `icon-on` and `icon-off` attributes to replace the default check/cross icons with custom ones. This is useful when the icons themselves communicate the meaning of the on/off states.

::: info
Custom icons are not rendered at the `sm` size. The handle is too small to display them legibly.
:::

```html {.example .horizontal}
<sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="sm">Theme</sl-switch>
<sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars">Theme</sl-switch>
<sl-switch icon-off="fas-sun-bright" icon-on="fas-moon-stars" size="lg">Theme</sl-switch>
```

### Disabled

Use the `disabled` attribute to prevent interaction with the switch.

```html {.example .horizontal}
<sl-switch disabled>Unchecked</sl-switch>
<sl-switch checked disabled>Checked</sl-switch>
```

### Without label

When there is no visible label, provide an accessible name using `aria-label`.

```html {.example}
<sl-switch aria-label="Enable notifications"></sl-switch>
```

## Accessibility

The switch uses a native `<input type="checkbox" role="switch">` in the light DOM, following the [ARIA switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/). This ensures proper keyboard interaction and screen reader announcements out of the box.

When a text label is provided as slot content, it is automatically associated with the input via `aria-labelledby`.

Keyboard interaction:

- `Space` or `Enter` — toggles the switch on or off

### ARIA

| Attribute        | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| `aria-label`     | Required when there is no visible label; provides an accessible name to screen readers. |
| `aria-labelledby`| Set automatically when slot content is present; associates the label with the input.    |
| `aria-checked`   | Managed automatically; reflects the current on/off state.                               |
