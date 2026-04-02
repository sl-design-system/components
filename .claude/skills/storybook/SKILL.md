---
name: storybook
description: Write or update Storybook stories for SL Design System web components following established patterns and conventions.
---

# Write or update Storybook stories for: $ARGUMENTS

You are writing Storybook stories for the SL Design System, a Lit 3 web component library. Follow the established patterns exactly.

## Step 1: Understand the component

Read the component source file(s) to understand:

- All public properties (decorated with `@property`) and their types/defaults
- All public methods
- All emitted events (`@event` decorators)
- All slots (look for `<slot>` in `render()`)
- CSS custom properties and parts (`@cssprop`, `@csspart` in JSDoc)
- Whether it uses `ScopedElementsMixin` or `FormControlMixin`
- Type aliases (e.g., `ButtonSize`, `BadgeVariant`)

## Step 2: Write or update the stories file

The stories file goes at `packages/components/<name>/src/<name>.stories.ts`.

### Import conventions

Imports are ordered: FontAwesome icons, side-effect register imports, Storybook, Lit, component types.

```typescript
// 1. FontAwesome icons (only if the component uses icons in stories)
import { faPlus, faGear } from '@fortawesome/pro-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/pro-solid-svg-icons';

// 2. Side-effect register imports for sibling components used in templates
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
// Always include the component's own register:
import '../register.js';

// 3. Storybook types
import { type Meta, type StoryObj } from '@storybook/web-components-vite';

// 4. Lit
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

// 5. Component class and types (type-only imports)
import { type Button } from './button.js';
import { type BadgeColor, type BadgeVariant } from './badge.js';

// 6. Icon registration at module level (if using FontAwesome)
Icon.register(faPlus, faGear);
```

Always import from `@storybook/web-components-vite` (not `@storybook/web-components`).

### Type definitions

Every file defines a `Props` type and a `Story` type alias:

```typescript
// Use Pick to select relevant component properties, add story-specific extras
type Props = Pick<Badge, 'color' | 'emphasis' | 'size' | 'variant'> & {
  icon?: boolean;
  text?: string;
};
type Story = StoryObj<Props>;
```

For complex components with slotted content, use function-typed args:

```typescript
type Props = Pick<Dialog, 'closeButton' | 'disableCancel'> & {
  body?(): string | TemplateResult;
  primaryActions?(): TemplateResult;
  title: string;
};
```

For form controls or components embedded within other components, function args can receive the Props object:

```typescript
type Props = Pick<Form, 'disabled'> & {
  fields(args: Props): TemplateResult;
};
```

Import `type TemplateResult` from `lit` when using function-typed args that return templates.

### Meta (default export)

Always use `satisfies Meta<Props>` (never `as Meta`):

```typescript
export default {
  title: 'Category/ComponentName',
  tags: ['stable'],
  args: {
    text: 'Label'
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['primary', 'default', 'danger'] }
  },
  render: ({ size, text, variant }) => html`
    <sl-button size=${ifDefined(size)} variant=${ifDefined(variant)}>${text}</sl-button>
  `
} satisfies Meta<Props>;
```

**Title categories** (use the appropriate one):

- `'Actions/Button'`
- `'Feedback & status/Badge'`
- `'Form/Select'`
- `'Layout/Card'`
- `'Media/Icon'`
- `'Navigation/Tabs'`
- `'Overlay/Dialog'`
- Nested: `'Form/Combobox/Single'`

**Tags** indicate maturity: `['stable']`, `['preview']`, or `['draft']`.

### argTypes patterns

```typescript
// Inline radio for short option lists (most common for enums)
size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }

// Radio for longer option lists
color: { control: 'radio', options: colors }

// Select dropdown for many options
position: { control: 'select', options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start'] }

// Range slider
headingSize: { control: { type: 'range', min: 14, max: 64, step: 1 } }

// Number
maxLength: { type: 'number' }

// Text
href: { control: 'text' }

// Hide from controls panel
badge: { table: { disable: true } }

// Conditional visibility
subheaderBadge: { control: 'text', if: { arg: 'subheaderContent' } }
```

Pre-define option arrays as module-level constants:

```typescript
const colors: BadgeColor[] = ['blue', 'green', 'grey', 'orange', 'red'];
const variants: BadgeVariant[] = ['solid', 'subtle', 'outline'];
```

### Template binding patterns

```typescript
// Attribute with ifDefined (for optional string/enum props)
color=${ifDefined(color)}

// Property binding (for complex objects, arrays)
.value=${value}
.items=${items}

// Boolean binding
?disabled=${disabled}
?checked=${checked}

// Conditional rendering with nothing
${icon ? html`<sl-icon name="check"></sl-icon>` : nothing}
```

### Render function in Meta

The Meta `render` function destructures the args and returns the component template:

```typescript
render: ({ color, disabled, size, text }) => html`
  <sl-badge color=${ifDefined(color)} ?disabled=${disabled} size=${ifDefined(size)}> ${text} </sl-badge>
`;
```

For form components, wrap in `<sl-form>` and `<sl-form-field>`:

```typescript
render: ({ disabled, hint, label, ...args }) => html`
  <sl-form>
    <sl-form-field .hint=${hint} .label=${label}>
      <sl-select ?disabled=${disabled}> ${args.options?.()} </sl-select>
    </sl-form-field>
  </sl-form>
`;
```

### Individual stories

**Minimal (inherits Meta render + args):**

```typescript
export const Basic: Story = {};
```

**With args overrides:**

```typescript
export const Disabled: Story = { args: { disabled: true } };
export const Pill: Story = { args: { shape: 'pill' } };
```

**Spreading args from another story:**

```typescript
export const AllDisabled: Story = { args: { ...All.args, disabled: true } };
```

**With its own render (overrides Meta render):**

```typescript
export const Custom: Story = {
  render: () => html`...`
};
```

**With per-story argTypes:**

```typescript
export const SizeInheritance: Story = {
  args: { headingSize: 28 },
  argTypes: { headingSize: { control: { type: 'range', min: 14, max: 64, step: 1 } } },
  render: ({ headingSize }) => html`...`
};
```

**With parameters:**

```typescript
// Chromatic configuration
export const Animated: Story = {
  parameters: { chromatic: { disableSnapshot: true } }
};

// Layout
export const Fullscreen: Story = {
  parameters: { layout: 'fullscreen' }
};

// Accessibility rule overrides
export const CustomA11y: Story = {
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', selector: 'sl-badge' }] } } }
};
```

**With viewport globals:**

```typescript
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } }
};
```

### "All" story (visual regression)

Nearly every component needs an `All` story that shows all visual states for Chromatic. Use CSS Grid for layout:

```typescript
export const All: Story = {
  render: () => html`
    <style>
      .wrapper {
        align-items: center;
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: auto repeat(3, 1fr);
      }
    </style>
    <div class="wrapper">
      <span></span>
      <span style="justify-self: center">sm</span>
      <span style="justify-self: center">md</span>
      <span style="justify-self: center">lg</span>

      <span>Default</span>
      <sl-badge size="sm">Badge</sl-badge>
      <sl-badge size="md">Badge</sl-badge>
      <sl-badge size="lg">Badge</sl-badge>

      <span>Disabled</span>
      <sl-badge size="sm" disabled>Badge</sl-badge>
      <sl-badge size="md" disabled>Badge</sl-badge>
      <sl-badge size="lg" disabled>Badge</sl-badge>
    </div>
  `
};
```

Use `Array.map()` for programmatic variant generation:

```typescript
${variants.map(variant => html`
  <span>${variant}</span>
  ${sizes.map(size => html`<sl-badge variant=${variant} size=${size}>Badge</sl-badge>`)}
`)}
```

### Loaders for async data

Use `loaders` when stories need async data (e.g., grid/table components):

```typescript
import { type Student, getStudents } from '@sl-design-system/example-data';

export default {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (args, { loaded: { students } }) => html` <sl-grid .items=${students}>...</sl-grid> `
} satisfies Meta<Props>;
```

### Cross-file exports

When multiple story files share data, export and use `excludeStories`:

```typescript
// combobox.stories.ts
export const components = ['Accordion', 'Avatar', 'Badge'];
export default {
  excludeStories: ['components']
  // ...
} satisfies Meta<Props>;

// single.stories.ts
import { components } from './combobox.stories.js';
```

### Inline custom elements

For complex interactive demos, define custom elements inside the story file:

```typescript
class AccordionToggleExample extends LitElement {
  override render() {
    return html`...`;
  }
}
try {
  customElements.define('accordion-toggle-example', AccordionToggleExample);
} catch {
  /* empty */
}

export const Toggle: Story = {
  render: () => html`<accordion-toggle-example></accordion-toggle-example>`
};
```

### Things to AVOID

- Do NOT use `as Meta<Props>` -- always use `satisfies Meta<Props>`
- Do NOT import from `@storybook/web-components` -- use `@storybook/web-components-vite`
- Do NOT use `play` functions unless absolutely necessary (e.g., opening a dialog)
- Do NOT use `decorators` unless absolutely necessary
- Do NOT add comments explaining obvious template structure
- Do NOT use `vi.fn()` -- use sinon `spy()` if event detection is needed
- Do NOT use `within` or `screen` from testing-library in stories

## Step 3: Verify

After writing the stories, start the dev server if not already running and check that the stories render correctly:

```
yarn start --watch
```

Navigate to the component's stories in Storybook (port 6006) and verify all stories render without errors.
