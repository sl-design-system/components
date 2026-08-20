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

const renderFormStory = (args: Props, description?: TemplateResult): TemplateResult => {
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
        color: var(--sl-color-text-subtle);
        font-size: 0.95rem;
        line-height: 1.5;
        margin-block: 0 var(--sl-size-300);
      }
    </style>
    ${description ? html`<p class="story-description">${description}</p>` : nothing}
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
};

export default {
  title: 'Form/Form',
  args: {
    disabled: false,
    reportValidity: false,
    validateOnBlur: false
  },
  render: args => renderFormStory(args)
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
        story: `Demonstrates the full default form.

**Required fields:** Text field, Date field, Time field, Number field, Text area, Checkbox, Checkbox group, Combobox single, Combobox multiple, Radio group, and Select.

**Optional field:** Switch.

Click **Report** to validate the whole form at once.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>All field types in their default state.</strong> This story includes every form
        control rendered by the default example. All visible fields are required except
        <strong>Switch</strong>, which is optional. Click <strong>Report</strong> to show the
        validation state for the full form.
      `
    ),
  args: {
    ...createAllArgs()
  }
};

export const AllDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the same field set as **All**, but with the entire form disabled.

All visible fields keep the same required or optional status: every field is required except **Switch**, which is optional.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>All field types in a disabled state.</strong> The same set of controls as in
        <strong>All</strong> is shown here, but the whole form is disabled. All visible fields are
        required except <strong>Switch</strong>, which remains optional when the form is enabled
        again via <strong>Toggle</strong>.
      `
    ),
  args: {
    ...All.args,
    disabled: true
  }
};

export const AllInvalid: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the default form after validation has been triggered.

All required fields start invalid until they are filled. **Switch** remains optional, so it does not show a required error.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>All field types after validation has been triggered.</strong> Every visible required
        field starts invalid until it gets a value. <strong>Switch</strong> is the only optional
        control in this set, so it is shown without a required error.
      `
    ),
  args: {
    ...All.args,
    reportValidity: true
  }
};

export const AllValid: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the default form with valid sample values.

Every required field is filled successfully. **Switch** remains optional, so the form is valid and ready to submit.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>All field types with valid sample values.</strong> Every visible required field has
        been filled successfully, while <strong>Switch</strong> stays optional. Use this story as
        the reference for a form that is ready to submit without validation errors.
      `
    ),
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
        story: `Demonstrates \`validateOnBlur\` on the full default form.

All visible fields are required except **Switch**. Required fields do not show an error when they are only focused and blurred, but they do show an error on blur after a value was changed and cleared. Untouched required fields still validate on submit.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>Validate on blur across the full default form.</strong> All visible fields are
        required except <strong>Switch</strong>. Required fields stay quiet when they are only
        focused and blurred, but once a value is changed and cleared they show an error on blur.
        Untouched required fields still validate on submit.
      `
    ),
  args: {
    reportValidity: false,
    validateOnBlur: true,
    ...createAllArgs()
  }
};

export const AllLarge: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the same field set as **All**, but with large-sized controls.

All visible fields are required except **Switch**, which remains optional.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>All field types in large size.</strong> This uses the same field set as
        <strong>All</strong>, but with larger controls for roomier layouts. All visible fields are
        required except <strong>Switch</strong>, which remains optional.
      `
    ),
  args: {
    ...createAllArgs({ size: 'lg' })
  }
};

export const AllPill: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the pill-shaped variant.

**Visible required fields:** Text field, Date field, Time field, Number field, Combobox single, Combobox multiple, and Select.

**Omitted in this variant:** Text area, Checkbox, Checkbox group, Radio group, and Switch.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>Pill-shaped form controls.</strong> This variant only renders the controls that
        support the pill shape in this demo: text, date, time, number, combobox single, combobox
        multiple, and select. Every visible field is required; text area, checkbox, checkbox group,
        radio group, and switch are intentionally omitted here.
      `
    ),
  args: {
    ...createAllArgs({ shape: 'pill' })
  }
};

export const AllPillLarge: Story = {
  parameters: {
    docs: {
      description: {
        story: `Shows the large pill-shaped variant.

It renders the same pill-compatible controls as **AllPill**, and every visible field is required.`
      }
    }
  },
  render: args =>
    renderFormStory(
      args,
      html`
        <strong>Pill-shaped form controls in large size.</strong> This is the large version of
        <strong>All Pill</strong>. It renders the same pill-compatible controls only, and every
        visible field is required.
      `
    ),
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
