---
name: test
description: Write or update Vitest browser tests for SL Design System web components following established patterns and conventions.
---

# Write or update tests for: $ARGUMENTS

You are writing tests for the SL Design System, a Lit 3 web component library. Follow the established patterns exactly.

## Step 1: Understand the component

Read the component source file(s) to understand:

- All public properties (decorated with `@property`)
- All public methods
- All emitted events (look for `@event` decorators and `dispatchEvent` calls)
- All internal state (`@state` decorator)
- Form integration (does it use `FormControlMixin`?)
- Keyboard interactions (look for `keydown`/`keyup` handlers)
- ARIA attribute proxying (look for `ariaAttributes` or `MutationObserver` on aria-\*)
- Slotted content handling

## Step 2: Write or update the spec file

The spec file goes at `packages/components/<name>/src/<name>.spec.ts`.

### Import conventions

Imports are ordered: external packages, then relative imports. Use these exact import sources:

```typescript
// Always needed:
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { ComponentName } from './component-name.js';

// Only when testing events or spying on methods:
import { spy } from 'sinon';

// Only when stubbing methods or restoring all stubs:
import { restore, spy, stub } from 'sinon';
// Add afterEach to vitest imports too, and add: afterEach(() => restore());

// Only when testing keyboard interactions:
import { userEvent } from 'vitest/browser';

// Only for form control components:
import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { LitElement, type TemplateResult, html } from 'lit';
// (merge the html import with the existing lit import)

// Only when using oneEvent helper (for awaiting a single event):
import { fixture, oneEvent } from '@sl-design-system/vitest-browser-lit';

// Only when mocking time (date/calendar components):
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Only when testing forwarded ARIA attributes (components using ForwardAriaMixin):
import {
  getForwardedAccessibleName,
  getForwardedDescription,
  getForwardedAriaAttribute,
  getForwardedAriaProperty,
  isForwardedDisabled
} from '@sl-design-system/shared/helpers/forward-aria.js';
```

### Test structure

```typescript
describe('sl-<name>', () => {
  let el: ComponentName;

  // ALWAYS start with a 'defaults' describe block
  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-<name>>...</sl-<name>>`);
    });

    // Test every public property's default value
    // Test every reflected attribute's absence or default
  });

  // Then group by feature/concern:
  // describe('disabled', () => { ... })
  // describe('validation', () => { ... })      -- if form control
  // describe('keyboard interactions', () => { ... })
  // describe('form reset', () => { ... })       -- if form control
  // describe('form integration', () => { ... }) -- if form control
});
```

### Test naming

- ALL test descriptions start with `should`: `it('should not be disabled', ...)`
- Be descriptive: `it('should emit an sl-change event when selecting an option', ...)`
- Negative tests are explicit: `it('should not have an explicit size', ...)`

### Fixture usage

- Always use `await fixture(html`...`)` to create components
- Use generic parameter for non-component fixtures: `await fixture<HTMLDivElement>(html`<div>...</div>`)`
- Always store the fixture result in a variable (`el`, or `wrapper` if it's not the element under test) for easy access
- Declare element variables at `describe`-block scope, assign in `beforeEach`
- The fixture helper auto-cleans up between tests; no manual teardown needed

### Assertion patterns

Use Chai's `expect` style with `chai-dom` extensions:

```typescript
// Attribute checks
expect(el).to.have.attribute('name', 'value');
expect(el).not.to.have.attribute('disabled');

// CSS pseudo-class matching
expect(el).to.match(':disabled');
expect(el).to.match(':checked');
expect(el).to.match(':popover-open');
expect(el).to.match(':state(some-state)');

// Text content
expect(el).to.have.trimmed.text('value');

// DOM checks
expect(el).to.exist;
expect(el).to.contain('child-selector');
expect(el).to.have.tagName('sl-button');

// Visibility & focus
expect(el).to.be.displayed;
expect(el).to.have.focus;

// Property checks
expect(el.disabled).to.be.true;
expect(el.size).to.be.undefined;
expect(arr).to.deep.equal([1, 2, 3]);
expect(arr).to.have.lengthOf(3);
```

### Shadow DOM access

```typescript
el.renderRoot.querySelector('...'); // shadow DOM queries
el.querySelector('...'); // light DOM queries
el.shadowRoot!.activeElement; // focus within shadow DOM
```

### Testing forwarded ARIA attributes

For components that use `ForwardAriaMixin`, use the forwarded ARIA helpers instead of directly querying inner elements:

```typescript
const button = el.renderRoot.querySelector('sl-button') as Button;

// Test accessible name (resolves aria-labelledby → aria-label → text content)
expect(getForwardedAccessibleName(button)).to.equal('Close');

// Test specific ARIA attributes
expect(getForwardedAriaAttribute(button, 'aria-haspopup')).to.equal('menu');
expect(getForwardedAriaAttribute(button, 'aria-expanded')).to.equal('true');

// Test ARIA properties
expect(getForwardedAriaProperty(button, 'ariaLabelledByElements')).to.deep.equal([labelEl]);

// Test disabled state forwarding
el.disabled = true;
await el.updateComplete;
expect(isForwardedDisabled(button)).to.be.true;
```

Always prefer these helpers over `button.getAttribute('aria-label')` — they correctly resolve the forwarded target regardless of shadow DOM nesting.

### Testing custom states

For components that use `ElementInternals.states`, test custom states with the `:state()` pseudo-class:

```typescript
// Test that a custom state is set
expect(el).to.match(':state(icon-only)');
expect(el).not.to.match(':state(empty)');

// Test after state change
el.textContent = '';
await el.updateComplete;
expect(el).to.match(':state(empty)');
```

### Async patterns

```typescript
// After setting a property, wait for re-render:
el.disabled = true;
await el.updateComplete;

// For MutationObserver callbacks or async event dispatching:
await new Promise(resolve => setTimeout(resolve, 50));

// For keyboard simulation:
el.focus();
await userEvent.keyboard('{Enter}');
await userEvent.keyboard('{ArrowDown}');
await userEvent.keyboard('{Escape}');
await userEvent.keyboard('{Space}');
await userEvent.keyboard('{Tab}');
await userEvent.keyboard('Lorem'); // typing text

// Also available:
await userEvent.tab();
await userEvent.click(element);
```

### Event testing

Always use sinon `spy()`:

```typescript
const onChange = spy();
el.addEventListener('sl-change', onChange);

// ... trigger action ...

expect(onChange).to.have.been.calledOnce;
expect(onChange).not.to.have.been.called;
expect(onChange).to.have.been.calledTwice;
```

To inspect event details:

```typescript
const onChange = spy();
el.addEventListener('sl-change', (event: SlChangeEvent) => {
  onChange(event.detail);
});
// ... trigger ...
expect(onChange.lastCall.args[0]).to.equal('value');
```

To test event prevention:

```typescript
const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
const stopSpy = spy(clickEvent, 'stopImmediatePropagation');
el.dispatchEvent(clickEvent);
expect(stopSpy).to.have.been.called;
```

### Form control testing

For components using `FormControlMixin`, include these test groups:

**In the `defaults` block**, test:

- `should be pristine` / `should be dirty after ...`
- `should be untouched` / `should be touched after losing focus`
- `should emit an sl-update-state event after ...`
- `should emit an sl-validate event when calling reportValidity`
- `should emit an sl-focus event when focusing`
- `should emit an sl-blur event when blurring`

**In a `validation` block**, test:

- `should be invalid when required and no value`
- `should have no validation message when valid`
- `should not have a show-validity attribute when reported` (when valid)
- `should have an invalid show-validity attribute when required and reported`
- `should emit an update-validity event when reported`
- `should have a custom validation message when it has a custom-validity attribute`
- `should have a custom validation message after calling setCustomValidity`

**In a `form integration` block**, use this inline test component pattern:

```typescript
describe('form integration', () => {
  let el: FormIntegrationTestComponent;

  class FormIntegrationTestComponent extends LitElement {
    onFormControl: (event: SlFormControlEvent) => void = spy();

    override render(): TemplateResult {
      return html`
        <sl-form-field label="Label">
          <sl-<name> @sl-form-control=${this.onFormControl}>...</sl-<name>>
        </sl-form-field>
      `;
    }
  }

  beforeEach(async () => {
    try {
      customElements.define('form-integration-test-component', FormIntegrationTestComponent);
    } catch {
      // empty
    }

    el = await fixture(html`<form-integration-test-component></form-integration-test-component>`);
  });

  it('should emit an sl-form-control event after first render', () => {
    expect(el.onFormControl).to.have.been.calledOnce;
  });
});
```

### Mocking

- Use sinon exclusively (not `vi.fn()`) for spies, stubs, and mocking
- Exception: use `vi.setSystemTime()` / `vi.useRealTimers()` for date/time mocking
- Always restore stubs in `afterEach`: either `consoleStub.restore()` or `afterEach(() => restore())`

### Things to AVOID

- Do NOT use snapshot testing
- Do NOT use `vi.fn()` -- use sinon `spy()` and `stub()` instead
- Do NOT use `waitFor` from testing-library -- use `await el.updateComplete` or `setTimeout` promises
- Do NOT use `screen` queries -- use `el.querySelector` or `el.renderRoot.querySelector`
- Do NOT add comments explaining what each test does -- the `it('should ...')` description is sufficient
- Do NOT import from `@testing-library/*`
- Do NOT add `@vitest/expect` -- chai assertions are already configured

## Step 3: Verify

After writing the tests, run them to confirm they pass:

```
vitest packages/components/<name>/src/<name>.spec.ts
```

Fix any failures before finishing.
