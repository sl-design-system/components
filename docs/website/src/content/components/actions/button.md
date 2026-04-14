---
title: Button
layout: component
eleventyNavigation:
  key: Button
  parent: Actions
  order: 1
---

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It is a key element for interaction and action.

```html {.example}
<sl-button>Button</sl-button>
```

## Examples

### Variants

Use the `variant` attribute to indicate the type of action.

```html {.example}
<sl-button-bar>
  <sl-button variant="primary">Primary</sl-button>
  <sl-button variant="secondary">Secondary</sl-button>
  <sl-button variant="success">Success</sl-button>
  <sl-button variant="info">Info</sl-button>
  <sl-button variant="warning">Warning</sl-button>
  <sl-button variant="danger">Danger</sl-button>
</sl-button-bar>
```

### Fill

Use the `fill` attribute to change the button's level of emphasis.

```html {.example}
<sl-button-bar>
  <sl-button>Solid</sl-button>
  <sl-button fill="outline">Outline</sl-button>
  <sl-button fill="link">Link</sl-button>
  <sl-button fill="ghost">Ghost</sl-button>
</sl-button-bar>
```

### Shape

Use the `shape` attribute to change the button's shape.

```html {.example}
<sl-button-bar>
  <sl-button>Square</sl-button>
  <sl-button shape="pill">Pill</sl-button>
</sl-button-bar>
```

### Size

Buttons are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent actions

```html {.example}
<sl-button-bar>
  <sl-button size="sm">Small</sl-button>
  <sl-button size="md">Medium</sl-button>
  <sl-button size="lg">Large</sl-button>
</sl-button-bar>
```

### Disabled

You can either use the `disabled` attribute to disable a button or set the `aria-disabled="true"` attribute for accessibility. The former will prevent the button from being focusable and will not trigger any events, while the latter will keep the button focusable but will indicate to assistive technologies that the action is unavailable.

```html {.example}
<sl-button-bar>
  <sl-button disabled>Disabled</sl-button>
  <sl-button aria-disabled="true">Aria Disabled</sl-button>
</sl-button-bar>
```

### Icon buttons

Icon buttons are used for actions that can be represented by an icon, such as "close" or "edit". Always provide a text label for accessibility, either through an `<sl-tooltip>` or using `aria-label`.

```html {.example}
<sl-button-bar>
  <sl-button aria-labelledby="icon-button-tooltip">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-button aria-labelledby="icon-button-tooltip" fill="outline">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-button aria-labelledby="icon-button-tooltip" fill="ghost">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-tooltip id="icon-button-tooltip">Smile!</sl-tooltip>
</sl-button-bar>
```

### Link buttons

Sometimes you want a link to look like a button. In that case, you can use the `fill="link"` attribute and wrap the button's content in an `<a href>` element.

```html {.example}
<sl-button-bar>
  <sl-button fill="link">
    <a href="https://example.com">Link</a>
  </sl-button>
  <sl-button fill="link">
    <a href="https://example.com" target="_blank">New window</a>
  </sl-button>
</sl-button-bar>
```

## Accessibility

The button component renders a native `<button>` element in its shadow DOM, ensuring proper keyboard navigation and screen reader support.

### Keyboard interaction

| Key     | Action                                    |
| ------- | ----------------------------------------- |
| `Enter` | Activates the button                      |
| `Space` | Activates the button                      |
| `Tab`   | Moves focus to the next focusable element |

### Best practices

- Always provide a visible text label
- Use `aria-label` only when a visible label is not possible (e.g. icon-only buttons)
- Don't disable buttons without explaining why the action is unavailable

## API

| Property   | Type                                              | Default       | Description                    |
| ---------- | ------------------------------------------------- | ------------- | ------------------------------ |
| `variant`  | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'secondary'` | Visual style of the button     |
| `size`     | `'sm' \| 'md' \| 'lg'`                            | `'md'`        | Size of the button             |
| `disabled` | `boolean`                                         | `false`       | Whether the button is disabled |

## Installation

```bash
yarn add @sl-design-system/button
```

Then import and register the component:

```javascript
import '@sl-design-system/button/register.js';
```
