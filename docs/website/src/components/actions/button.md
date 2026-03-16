---
title: Button
layout: base.njk
eleventyNavigation:
  key: Button
  parent: Actions
  order: 1
---

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It is a key element for interaction and action.

## Usage

Use buttons for the most important actions you want users to take. Use clear, descriptive labels that explain what happens when the button is clicked.

```html
<sl-button>Click me</sl-button>
```

### Variants

Buttons come in several variants to indicate the level of emphasis:

- **Primary** — For the main action on a page. Use sparingly.
- **Secondary** — For supporting actions. This is the default.
- **Ghost** — For low-emphasis actions that blend with surrounding content.
- **Danger** — For destructive actions like deleting data.

```html
<sl-button variant="primary">Save</sl-button>
<sl-button variant="secondary">Cancel</sl-button>
<sl-button variant="ghost">Learn more</sl-button>
<sl-button variant="danger">Delete</sl-button>
```

### Sizes

Buttons are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent actions

```html
<sl-button size="sm">Small</sl-button>
<sl-button size="md">Medium</sl-button>
<sl-button size="lg">Large</sl-button>
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
