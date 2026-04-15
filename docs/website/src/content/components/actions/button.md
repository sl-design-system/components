---
title: Button
layout: component
issueNumber: 2315
storybook: actions-button--basic
eleventyNavigation:
  key: Button
  parent: Actions
  order: 1
---

```html {.example .show-source}
<sl-button>Button</sl-button>
```

## Usage

Buttons should be used in user interfaces when you want to provide users with a clear and actionable way to interact with a webpage, application, or device.

Buttons are used to trigger specific actions or functions. For example, you can use a "Submit" button in a form to send user input to a server, or a "Save" button to save changes in an application.

::: info
Do not disable a button by default and leave it up to the user to figure out why the action is unavailable. Instead, provide an explanation using a tooltip or by including helper text next to the button.
:::

## Examples

### Variants

Use the `variant` attribute to indicate the urgency or sentiment of the action.

Primary
: The most important action on the page; the next step in the main user flow.

Secondary
: Secondary flows, or when there is no clear hierarchy (e.g. dashboards).

Success
: Confirming a successful or completed operation.

Info
: Neutral actions that provide additional context or information.

Warning
: Actions requiring caution or extra user confirmation.

Danger
: Irreversible or potentially destructive actions.

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

There is an additional `inverted` variant that is designed for use on dark backgrounds.

```html {.example .inverted}
<sl-button variant="inverted">Inverted</sl-button>
```

### Fill

Use the `fill` attribute to indicate how essential the action is.

Solid
: Essential actions that move the user forward in the flow.

Outline
: Important but optional; draws attention without blocking progress.

Ghost
: Suggestive or secondary actions that shouldn't distract from the main flow.

Link
: Informational actions, such as "Read more" or "View details".

```html {.example}
<sl-button-bar>
  <sl-button>Solid</sl-button>
  <sl-button fill="outline">Outline</sl-button>
  <sl-button fill="ghost">Ghost</sl-button>
  <sl-button fill="link">Link</sl-button>
</sl-button-bar>
```

### Shape

Use the `shape` attribute to change the button's shape.

```html {.example}
<sl-button-bar>
  <sl-button>Square</sl-button>
  <sl-button shape="pill">Pill</sl-button>
  <sl-button aria-label="Smile" shape="pill">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
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

You can either use the `disabled` attribute to disable a button or set the `aria-disabled="true"` attribute for accessibility. Both will not trigger any events. The former will prevent the button from being focusable, while the latter will keep the button focusable but will indicate to assistive technologies that the action is unavailable.

```html {.example}
<sl-button-bar>
  <sl-button disabled>Disabled</sl-button>
  <sl-button aria-disabled="true">Aria Disabled</sl-button>
</sl-button-bar>
```

The `aria-disabled="true"` attribute should not be used as a one-for-one replacement for the `disabled` attribute because they have different functionalities.

Both:

- visually dim the button
- prevent actions (click, enter/space) on the button
- announce the button as 'dimmed' or 'disabled' in a screenreader

However, there are some differences:

- `disabled` takes the button out of the tab-focus sequence, `aria-disabled` does not
- `disabled` disables all pointer events, `aria-disabled` does not

The difference can be useful when you want to combine a disabled button with a tooltip. In that case you want the button to be focusable (so you can hover or tab to it) but you also want it to be dimmed and not clickable. In that case you would use `aria-disabled` instead of `disabled`.

When `disabled` is added to a button there is no need to also add `aria-disabled`; everything `aria-disabled` does, `disabled` does as well.

You can read more on the difference and in which scenarios which option might be preferable on the [MDN page about aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).

### Icon

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

### Command

The button component supports the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API). This allows you to declaratively connect a button to another element and invoke a command on it, without needing any JavaScript.

Use the `command` attribute to specify the command to invoke, and the `commandfor` attribute to reference the `id` of the target element. The `id` must be in the same DOM scope as the button (i.e. the same document or shadow root). If you already have a JavaScript reference to the target element, you can set the `commandForElement` property directly instead.

::: info
Note that not all browsers support the Invoker Commands API yet. When in doubt, use the [invokers-polyfill](https://github.com/keithamus/invokers-polyfill) to ensure compatibility.
:::

Custom elements cannot use the same commands as native elements, but they can define their own custom commands. For example, the `<sl-dialog>` component defines a `--show-modal` command to open the dialog and a `--close` command to close it.

```html {.example}
<sl-button command="--show-modal" commandfor="invoker-dialog" variant="primary"> Open dialog </sl-button>
<sl-dialog id="invoker-dialog">
  <h1 slot="title">Commands Example</h1>
  <p>This dialog was opened without any JavaScript.</p>
  <sl-button command="--close" commandfor="invoker-dialog" slot="primary-actions"> Close </sl-button>
</sl-dialog>
```

## Accessibility

The button component renders a native `<button>` element in its shadow DOM, ensuring proper keyboard navigation and screen reader support.

When the button only has an icon and no visible text, make sure to provide an accessible name using `aria-label` or by associating it with a tooltip:

```html
<sl-button aria-describedby="tooltip">
  <sl-icon name="face-smile"></sl-icon>
</sl-button>
<sl-tooltip id="tooltip">Smile!</sl-tooltip>
```

### ARIA

The following ARIA attributes can be used with the button component:

| Attribute          | Description                                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aria-label`       | To be used when the button is icon-only and its meaning is clear.                                                                                                                       |
| `aria-labelledby`  | When a different element serves as the label, for example in the case of an icon-only button that has a label outside the button, this property can be set to the `id` of that element. |
| `aria-describedby` | When the button needs extra explanation or description you can reference this element here by the `id`.                                                                                 |
| `aria-disabled`    | Announces the button as disabled with a screenreader. See [Disabled](#disabled) for more explanation.                                                                                   |

There is a subtle difference between `aria-labelledby` and `aria-describedby`: a label should be concise, where a description is intended to provide more verbose information. A description can for example be "Items in the trash will be permanently removed after 30 days." to explain what (delayed) effect a "Move to trash" button has.
