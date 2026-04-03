---
name: accessibility
description: Make SL Design System web components accessible. Covers ARIA roles and attributes, keyboard navigation, focus management, ForwardAriaMixin, shadow DOM a11y constraints, and lit-a11y lint rules.
---

# Accessibility guide for: $ARGUMENTS

You are making an SL Design System Lit 3 web component accessible. The design system targets WCAG 2.1 AA compliance. Follow these patterns exactly.

## Core constraint: shadow DOM and ARIA

Screen readers cannot pierce shadow boundaries. ARIA attributes set on the custom element host (e.g. `aria-label`, `aria-labelledby`) are invisible to elements inside shadow DOM. The solution depends on the component type:

### Option A — `ForwardAriaMixin` (interactive elements)

Use for any component that wraps a native interactive element (`<button>`, `<input>`, `<a>`, etc.) inside shadow DOM.

```ts
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';

export class MyComponent extends ForwardAriaMixin(LitElement) {
  @query('button') button!: HTMLButtonElement;

  override firstUpdated(): void {
    this.setProxyTarget(this.button);
  }
}
```

`ForwardAriaMixin` observes all `aria-*` attributes on the host and forwards them to the proxy target. It also resolves `aria-labelledby` / `aria-describedby` IDs to actual `Element` references so they cross the shadow boundary.

To forward only specific attributes (avoids unnecessary observation):

```ts
export class MyComponent extends ForwardAriaMixin(LitElement, ['aria-label', 'aria-disabled']) {
```

### Option B — `delegatesFocus` (buttons, links)

When the component itself should receive focus and delegate it inward:

```ts
static override shadowRootOptions: ShadowRootInit = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
```

Combine with `ForwardAriaMixin` for full ARIA forwarding.

### Option C — `role` on host (landmark/widget roles)

When the custom element itself *is* the ARIA widget (no inner native element):

```ts
override connectedCallback(): void {
  super.connectedCallback();
  if (!this.hasAttribute('role')) {
    this.setAttribute('role', 'listbox');
  }
}
```

Do not hard-code `role` in `render()` — set it on the host in `connectedCallback` so it appears in the accessibility tree at the host level.

## ARIA attribute patterns

### Label (required for all interactive controls)

Preference order:
1. Visible text via `<label>` or slotted content — no extra ARIA needed.
2. `aria-labelledby` pointing to an existing visible element.
3. `aria-label` for icon-only buttons or controls without visible label.

```html
<!-- Icon-only button — always needs aria-label -->
<sl-button>
  <sl-icon name="xmark" aria-hidden="true"></sl-icon>
</sl-button>
<!-- Consumer provides: <sl-button aria-label="Close dialog"> -->
```

In the component template, hide purely decorative icons from AT:

```ts
html`<sl-icon name="chevron-down" aria-hidden="true"></sl-icon>`
```

### Expanded / collapsed state

```ts
@property({ type: Boolean, reflect: true }) open?: boolean;

// In render():
html`<button aria-expanded=${this.open ? 'true' : 'false'} aria-controls="panel">Toggle</button>
     <div id="panel" ?hidden=${!this.open}><slot></slot></div>`
```

### Disabled state

Prefer native `disabled` on form controls. For non-native elements use `aria-disabled="true"` (keeps element focusable for keyboard users):

```ts
@property({ type: Boolean, reflect: true }) disabled?: boolean;

// In render():
html`<div role="option" aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}>`
```

### Selected / checked state

```ts
html`<div role="option" aria-selected=${this.selected ? 'true' : 'false'}>`
html`<div role="checkbox" aria-checked=${this.checked ? 'true' : 'false'}>`
```

### Live regions (dynamic content updates)

```ts
html`<div aria-live="polite" aria-atomic="true">${this.statusMessage}</div>`
// Use aria-live="assertive" only for critical errors/interruptions.
```

## Keyboard navigation

### Basic button / trigger

All interactive custom elements must respond to `Enter` and `Space`:

```ts
#events = new EventsController(this, {
  keydown: this.#onKeydown
});

#onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.#doAction();
  }
}
```

`EventsController` from `@sl-design-system/shared` auto-adds and removes the listener.

### Roving tabindex (list/menu/grid)

Use roving tabindex for composite widgets (listbox, menu, toolbar, grid) so only one item is in the tab sequence at a time:

```ts
// Parent manages which child is active:
@state() private _activeIndex = 0;

// Set tabindex on children after render:
override updated(): void {
  this.items.forEach((item, i) => {
    item.tabIndex = i === this._activeIndex ? 0 : -1;
  });
}

// Arrow keys move focus:
#onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this._activeIndex = Math.min(this._activeIndex + 1, this.items.length - 1);
    this.items[this._activeIndex].focus();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    this._activeIndex = Math.max(this._activeIndex - 1, 0);
    this.items[this._activeIndex].focus();
  } else if (event.key === 'Home') {
    event.preventDefault();
    this._activeIndex = 0;
    this.items[0].focus();
  } else if (event.key === 'End') {
    event.preventDefault();
    this._activeIndex = this.items.length - 1;
    this.items[this._activeIndex].focus();
  }
}
```

### Focus trapping (dialog / popover)

For modal dialogs, focus must not leave the dialog while it is open. Use the browser's native `<dialog>` element or a focus trap:

```ts
// Prefer native dialog — it handles focus trap automatically:
html`<dialog>${...}<slot></slot></dialog>`

// Call showModal() to open (not show()):
this.renderRoot.querySelector('dialog')!.showModal();
```

For non-modal popovers, use the Popover API (`popover` attribute) which does not trap focus.

### Escape key

Close popovers, dialogs, and menus on `Escape`:

```ts
#onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    this.open = false;
  }
}
```

## Focus management

### Return focus after close

When closing a dialog or popover, return focus to the element that triggered it:

```ts
#triggerElement?: HTMLElement;

#onOpen(): void {
  this.#triggerElement = document.activeElement as HTMLElement;
  this.open = true;
}

#onClose(): void {
  this.open = false;
  this.#triggerElement?.focus();
}
```

### Focus on open

Move focus into a dialog/panel when it opens:

```ts
override updated(changed: PropertyValues): void {
  if (changed.has('open') && this.open) {
    // Focus first focusable element, or the dialog itself
    const first = this.renderRoot.querySelector<HTMLElement>('[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    first?.focus();
  }
}
```

### `inert` attribute

Use `inert` to make hidden content unfocusable (better than `display:none` for animated panels):

```ts
html`<div ?inert=${!this.open}><slot></slot></div>`
```

## Color and visual accessibility

- Never convey information by color alone — pair with an icon, text, or pattern.
- Ensure text meets WCAG contrast: 4.5:1 for normal text, 3:1 for large text and UI components.
- Always use tokens (`--sl-color-*`) — they are tuned for contrast in both light and dark mode.
- Focus indicators: use `--sl-color-border-focused` with `--sl-size-borderWidth-focusRing` and `--sl-size-outlineOffset-default`.

```scss
:host(:focus-visible) {
  outline: var(--sl-size-borderWidth-focusRing) solid var(--sl-color-border-focused);
  outline-offset: var(--sl-size-outlineOffset-default);
}
```

Never suppress the focus ring with `outline: none` without providing an equivalent custom indicator.

## `lit-a11y` lint rules

The project uses `eslint-plugin-lit-a11y`. Common violations to avoid:

| Rule | What it checks |
|---|---|
| `click-events-have-key-events` | `@click` handlers must also handle keyboard |
| `no-autofocus` | Avoid `autofocus` attribute (use programmatic focus) |
| `anchor-is-valid` | `<a>` must have `href` or `role="button"` + keyboard handler |
| `alt-text` | `<img>` must have `alt` |
| `aria-attrs` | Only valid ARIA attributes |
| `aria-role` | Only valid ARIA roles |
| `interactive-supports-focus` | Interactive roles must be focusable |
| `no-redundant-role` | Don't set `role="button"` on `<button>` |

## Checklist before shipping

- [ ] Every interactive element is reachable by keyboard (`Tab`, arrow keys as appropriate)
- [ ] Every interactive element has a visible focus indicator
- [ ] Every control has an accessible name (visible label, `aria-label`, or `aria-labelledby`)
- [ ] State changes (open/close, checked, selected, disabled) are reflected in ARIA attributes
- [ ] Decorative images and icons have `aria-hidden="true"`
- [ ] Dialogs trap focus; return focus on close
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI)
- [ ] `ForwardAriaMixin` is used for components wrapping native interactive elements
- [ ] `yarn lint` passes with no a11y violations
