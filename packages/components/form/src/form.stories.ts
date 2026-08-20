import { ScopedElementsMixin } from '@open-wc/scoped-elements/html-element.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/number-field/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/time-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type Form } from './form.js';
import './register.js';

type Props = Pick<Form, 'disabled' | 'validateOnBlur' | 'value'> & {
  buttons?(): TemplateResult;
  fields(args: Props): TemplateResult;
  reset: boolean;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;

type AllStoryOptions = {
  shape?: 'pill';
  size?: 'lg';
};

interface SelectElement extends HTMLElement {
  value?: string;
}

class customComponent extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  override render() {
    return html`
      <sl-form-field label="Text field">
        <sl-text-field name="textField" required></sl-text-field>
      </sl-form-field>
    `;
  }
}

try {
  customElements.define('custom-component', customComponent);
} catch {
  /* empty */
}

const renderAllFields = (
  { disabled }: Pick<Props, 'disabled'>,
  options: AllStoryOptions = {}
): TemplateResult => {
  const { shape, size } = options,
    isPill = shape === 'pill';

  return html`
    <sl-form-field hint="Hint text" label="Text field">
      <sl-text-field
        ?disabled=${disabled}
        name="textField"
        placeholder="Placeholder"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}></sl-text-field>
    </sl-form-field>

    <sl-form-field hint="Hint text" label="Date field">
      <sl-date-field
        name="dateField"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}></sl-date-field>
    </sl-form-field>

    <sl-form-field hint="Hint text" label="Time field">
      <sl-time-field
        name="timeField"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}></sl-time-field>
    </sl-form-field>

    <sl-form-field hint="Hint text" label="Number field">
      <sl-number-field
        name="numberField"
        placeholder="123"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}
        style="max-inline-size: 12rem;"
        step-buttons="end"></sl-number-field>
    </sl-form-field>

    ${
      isPill
        ? nothing
        : html`
            <sl-form-field hint="Hint text" label="Text area">
              <sl-text-area
                ?disabled=${disabled}
                name="textArea"
                placeholder="Placeholder"
                required
                size=${ifDefined(size)}></sl-text-area>
            </sl-form-field>

            <sl-form-field hint="Hint text" label="Checkbox">
              <sl-checkbox
                ?disabled=${disabled}
                name="checkbox"
                required
                size=${ifDefined(size)}
                value="checked"
                >Checkbox</sl-checkbox
              >
            </sl-form-field>

            <sl-form-field hint="Hint text" label="Checkbox group">
              <sl-checkbox-group
                ?disabled=${disabled}
                name="checkboxGroup"
                required
                size=${ifDefined(size)}>
                <sl-checkbox value="0">Check me</sl-checkbox>
                <sl-checkbox value="1">No me</sl-checkbox>
                <sl-checkbox value="2">I was here first</sl-checkbox>
              </sl-checkbox-group>
            </sl-form-field>
          `
    }

    <sl-form-field hint="Hint text" label="Combobox single">
      <sl-combobox
        ?disabled=${disabled}
        name="comboboxSingle"
        placeholder="Single select"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
          <sl-option>Option 4</sl-option>
        </sl-listbox>
      </sl-combobox>
    </sl-form-field>

    <sl-form-field hint="Hint text" label="Combobox multiple">
      <sl-combobox
        ?disabled=${disabled}
        name="comboboxMultiple"
        multiple
        placeholder="Multiple select"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
          <sl-option>Option 4</sl-option>
        </sl-listbox>
      </sl-combobox>
    </sl-form-field>

    ${
      isPill
        ? nothing
        : html`
            <sl-form-field hint="Hint text" label="Radio group">
              <sl-radio-group
                ?disabled=${disabled}
                name="radioGroup"
                required
                size=${ifDefined(size)}>
                <sl-radio value="1">One</sl-radio>
                <sl-radio value="2">Two</sl-radio>
                <sl-radio value="3">Three</sl-radio>
              </sl-radio-group>
            </sl-form-field>
          `
    }

    <sl-form-field hint="Hint text" label="Select">
      <sl-select
        ?disabled=${disabled}
        name="select"
        placeholder="Placeholder"
        required
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}>
        <sl-option value="1">Option 1</sl-option>
        <sl-option value="2">Option 2</sl-option>
        <sl-option value="3">Option 3</sl-option>
      </sl-select>
    </sl-form-field>

    ${
      isPill
        ? nothing
        : html`
            <sl-form-field hint="Hint text" label="Switch">
              <sl-switch
                ?disabled=${disabled}
                name="switch"
                reverse
                size=${ifDefined(size)}
                value="toggled"
                >Toggle me</sl-switch
              >
            </sl-form-field>
          `
    }
  `;
};

const createAllArgs = (options: AllStoryOptions = {}): Pick<Props, 'fields'> => ({
  fields: args => renderAllFields(args, options)
});

export default {
  title: 'Form/Form',
  args: {
    disabled: false,
    reportValidity: false,
    validateOnBlur: false
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;

      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;

      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
      </style>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: `A simple form with a single required text field.
Perfect for testing basic form behavior and validation.`
      }
    }
  },
  args: {
    fields: () => html`
      <sl-form-field label="Text field">
        <sl-text-field name="textField" required></sl-text-field>
      </sl-form-field>
    `
  }
};

export const Autofocus: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Text field 1 (autofocus)">
        <sl-text-field name="textField-1" required autofocus></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Text field 2">
        <sl-text-field name="textField-2"></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Text field 3">
        <sl-text-field name="textField-3"></sl-text-field>
      </sl-form-field>
    `
  }
};

export const Reset: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates form reset functionality.

**Initial state:**
- First field has pre-filled value: "Value set initially"
- Second field is empty (required)

Click "Reset" to restore initial values. Validation runs on load showing the second field as invalid.`
      }
    }
  },
  args: {
    reset: true,
    reportValidity: true,
    fields: () => html`
      <sl-form-field hint="Has value on load" label="Text field">
        <sl-text-field
          name="input"
          placeholder="Placeholder"
          required
          value="Value set initially"></sl-text-field>
      </sl-form-field>
      <sl-form-field hint="Has no value on load" label="Text field">
        <sl-text-field name="input2" placeholder="Placeholder" required></sl-text-field>
      </sl-form-field>
    `,
    value: {
      input: 'Value set initially'
    }
  }
};

export const Array: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Item 1">
        <sl-text-field name="items[0]" required></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Item 2">
        <sl-text-field name="items[1]" required></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Item 3">
        <sl-text-field name="items[2]" required></sl-text-field>
      </sl-form-field>
    `
  }
};

export const DeepName: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Deep name">
        <sl-text-field name="deep.name" required></sl-text-field>
      </sl-form-field>
    `,
    value: {
      deep: {
        name: 'Deep name'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: {
      textField: 'Hello world'
    }
  }
};

export const ValidateOnBlur: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates \`validateOnBlur\` behavior with three main scenarios:
- **Email field**: Invalid email format is shown immediately on blur (when field has been modified)
- **Code field**: Pattern validation (AB-123) is shown on blur (when field has been modified)
- **Required field**: Only shows invalid if user entered text and then cleared it. Never-touched required fields won't show errors on blur, only on submit.

Try: Tab through without typing → no errors. Type then delete → error on blur.`
      }
    }
  },
  args: {
    fields: () => html`
      <sl-form-field hint="Invalid email format is shown on blur" label="Email">
        <sl-text-field name="email" type="email"></sl-text-field>
      </sl-form-field>

      <sl-form-field hint="Must match pattern AB-123 (shown on blur)" label="Code">
        <sl-text-field name="code" pattern="[A-Z]{2}-[0-9]{3}" placeholder="AB-123"></sl-text-field>
      </sl-form-field>

      <sl-form-field hint="Shown on blur when touched and cleared" label="Required text field">
        <sl-text-field name="requiredField" required></sl-text-field>
      </sl-form-field>
    `,
    validateOnBlur: true
  }
};

export const CustomComponent: Story = {
  args: {
    reportValidity: false,
    fields: ({ disabled }) => html`
      <sl-form-field hint="Hint text" label="Text field">
        <sl-text-field
          ?disabled=${disabled}
          name="customTextField"
          placeholder="Placeholder"
          required></sl-text-field>
      </sl-form-field>
      <custom-component></custom-component>
    `
  }
};

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates all available form field types with validation enabled.

**Fields included (all required):**
- Text field, Date field, Time field, Number field
- Text area, Checkbox, Checkbox group, Radio group
- Combobox (single & multiple), Select
- Switch

Click "Report" to validate all fields at once.`
      }
    }
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;
      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');
      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;
      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
        .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
        }
      </style>
      <p class="story-description">
        <strong>All field types with validation enabled.</strong> All fields are required. Click
        "Report" to validate all fields at once. This story demonstrates all available form
        components.
      </p>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  },
  args: {
    ...createAllArgs()
  }
};

export const AllDisabled: Story = {
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;
      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');
      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;
      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
        .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
        }
      </style>
      <p class="story-description">
        <strong>All field types in disabled state.</strong> The entire form is disabled, preventing
        user interaction. Click "Toggle" to enable/disable the form.
      </p>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  },
  args: {
    ...All.args,
    disabled: true
  }
};

export const AllInvalid: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows all field types in an **invalid state** with validation errors displayed.

Automatically calls \`reportValidity()\` when the story loads, triggering validation for all empty required fields.`
      }
    }
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;
      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');
      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;
      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
        .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
        }
      </style>
      <p class="story-description">
        <strong>All field types in invalid state.</strong> All fields are shown with validation
        errors. This demonstrates how validation messages appear when fields are empty or have
        format errors.
      </p>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  },
  args: {
    ...All.args,
    reportValidity: true
  }
};

export const AllValid: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows all field types in a **valid state** with pre-filled values.

Demonstrates:
- All required fields properly filled
- No validation errors
- Form ready for submission`
      }
    }
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;
      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');
      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;
      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
        .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
        }
      </style>
      <p class="story-description">
        <strong>All field types in valid state.</strong> All fields are pre-filled with valid
        values. This demonstrates a form that is ready for submission with no errors.
      </p>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  },
  args: {
    ...All.args,
    reportValidity: true,
    reset: true,
    value: {
      checkbox: 'checked',
      checkboxGroup: ['1'],
      comboboxSingle: 'Option 2',
      comboboxMultiple: ['Option 1', 'Option 2'],
      dateField: new Date(),
      numberField: '123',
      radioGroup: '2',
      select: '2',
      textArea: 'Text area',
      textField: 'Text field',
      timeField: '12:00'
    }
  }
};

export const AllValidateOnBlur: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates \`validateOnBlur\` behavior with **all field types**. All fields are required.

**Validation behavior:**
- ✓ Format/type errors (email, pattern) are shown immediately on blur when field is modified
- ✓ Required empty fields only show errors if user modified them and cleared them
- ✓ Just navigating through fields (Tab) without typing won't trigger errors
- ✓ Empty required fields still validate on form submit

**Try it:** Tab through without typing → navigate away → no errors. Type something → delete it → blur → error shown.`
      }
    }
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, validateOnBlur, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;
      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');
      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;
      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
        .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
        }
      </style>
      <p class="story-description">
        <strong>Validate on blur with all field types.</strong> Try tabbing through without typing —
        no errors. Then type something and delete it — you'll see errors on blur. Format errors
        (email, pattern) also show on blur. Only on submit will empty required fields show errors if
        never touched.
      </p>
      <sl-form
        @sl-update-state=${onUpdate}
        @sl-update-validity=${onUpdate}
        ?disabled=${disabled}
        ?validate-on-blur=${validateOnBlur}
        .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${
            buttons?.() ??
            html`
              <sl-button @click=${onToggle}>Toggle</sl-button>
              ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
              <sl-button @click=${onReport} variant="primary">Report</sl-button>
            `
          }
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  },
  args: {
    reportValidity: false,
    validateOnBlur: true,
    ...createAllArgs()
  }
};

export const AllLarge: Story = {
  args: {
    ...createAllArgs({ size: 'lg' })
  }
};

export const AllPill: Story = {
  args: {
    ...createAllArgs({ shape: 'pill' })
  }
};

export const AllPillLarge: Story = {
  args: {
    ...createAllArgs({ shape: 'pill', size: 'lg' })
  }
};

export const AsyncValidation: Story = {
  render: () => {
    const onSync = async (): Promise<void> => {
      const form = document.querySelector<Form>('sl-form');
      const select = form?.querySelector<SelectElement>('sl-select');

      if (!form || !select) return;

      select.value = '1';
      await form.updateComplete;

      select.value = undefined;

      alert(
        `Synchronous (form.valid): ${form.valid}\n(Returns true because the update cycle hasn't finished)`
      );
    };

    const onAsync = async (): Promise<void> => {
      const form = document.querySelector<Form>('sl-form');
      const select = form?.querySelector<SelectElement>('sl-select');

      if (!form || !select) return;

      select.value = '1';
      await form.updateComplete;

      select.value = undefined;

      await form.updateComplete;
      const isValid = form.valid;
      alert(
        `Asynchronous (form.updateComplete): ${isValid}\n(Correctly waits and reflects the invalid state)`
      );
    };

    return html`
      <p style="margin-bottom: var(--sl-size-200);">
        This demo shows how to correctly check form validity after a programmatic change. Clicking
        the buttons will automatically set the required select to an invalid state (empty) and then
        immediately check the form's validity.
      </p>
      <sl-form id="async-validation-form">
        <sl-form-field label="Select (required)">
          <sl-select value="1" required placeholder="Select an option">
            <sl-option value="1">Option 1</sl-option>
            <sl-option value="2">Option 2</sl-option>
          </sl-select>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onSync}>Sync way (buggy)</sl-button>
          <sl-button @click=${onAsync} variant="primary">Async way (correct)</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};
