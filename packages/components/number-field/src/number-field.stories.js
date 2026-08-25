import '@sl-design-system/form/register.js';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Form/Number field',
  args: {
    inputSize: 8,
    label: 'Number'
  },
  argTypes: {
    hint: {
      table: { disable: true }
    },
    label: {
      table: { disable: true }
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    stepButtons: {
      control: 'inline-radio',
      options: ['end', 'edges']
    }
  },
  render: ({
    disabled,
    formatOptions,
    label,
    hint,
    inputSize,
    locale,
    max,
    min,
    placeholder,
    readonly,
    reportValidity,
    required,
    size,
    step,
    stepButtons,
    valueAsNumber
  }) => {
    const onClick = event => {
      event.target.closest('sl-form')?.reportValidity();
    };
    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-number-field
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?required=${required}
            .formatOptions=${formatOptions}
            .valueAsNumber=${valueAsNumber}
            input-size=${ifDefined(inputSize)}
            locale=${ifDefined(locale)}
            max=${ifDefined(max)}
            min=${ifDefined(min)}
            placeholder=${ifDefined(placeholder)}
            size=${ifDefined(size)}
            step=${ifDefined(step)}
            step-buttons=${ifDefined(stepButtons)}></sl-number-field>
        </sl-form-field>
        ${
          reportValidity
            ? html`
                <sl-button-bar>
                  <sl-button @click=${onClick}>Report validity</sl-button>
                </sl-button-bar>
              `
            : nothing
        }
      </sl-form>
    `;
  }
};
export const Basic = {
  args: {
    valueAsNumber: 1024
  }
};
export const Disabled = {
  args: {
    ...Basic.args,
    disabled: true
  }
};
export const FormatCurrency = {
  args: {
    formatOptions: { style: 'currency', currency: 'EUR' },
    hint: 'The number is formatted as EUR currency based on the current locale (e.g., "\u20AC9.90" in "en"). Change the locale to see the format update. Type an invalid value to see an error message when clicking the button.',
    reportValidity: true,
    step: 0.01,
    valueAsNumber: 9.9
  }
};
export const FormatPercent = {
  args: {
    formatOptions: { style: 'percent', maximumFractionDigits: 2 },
    hint: 'The number is formatted as a percentage with a format based on the current locale (e.g., "1,000.25%" in "en"). Change the locale to see the format update. Type an invalid value to see an error message when clicking the button.',
    reportValidity: true,
    step: 0.01,
    valueAsNumber: 10
  }
};
export const FormatUnit = {
  args: {
    formatOptions: { style: 'unit', unit: 'meter', unitDisplay: 'long' },
    hint: 'The number is formatted as meters with long unit display based on the current locale (e.g., "100 meters" in "en"). Change the locale to see the format update. Type an invalid value to see an error message when clicking the button.',
    inputSize: 10,
    reportValidity: true,
    valueAsNumber: 100
  }
};
export const MinMax = {
  args: {
    hint: 'The number must be between 0 and 10. The current value ("50") is outside this range. Click the button to see an error message.',
    max: 10,
    min: 0,
    reportValidity: true,
    valueAsNumber: 50
  }
};
export const Readonly = {
  args: {
    ...Basic.args,
    hint: 'The field is readonly, you can focus it, but you cannot enter any text.',
    readonly: true
  }
};
export const Required = {
  args: {
    hint: 'This field is required and has a maximum value of 10. Leave it empty, type an invalid value or exceed the max to see an error message when clicking the button.',
    max: 10,
    reportValidity: true,
    required: true
  }
};
export const CustomValidity = {
  render: () => {
    const onClick = event => {
      event.target.closest('sl-form')?.reportValidity();
    };
    const onValidate = event => {
      const value = event.target.valueAsNumber;
      let message = '';
      if (value !== void 0 && value !== 42) {
        message = 'Enter 42';
      }
      event.target.setCustomValidity(message);
    };
    return html`
      <sl-form>
        <sl-form-field
          hint="This field uses built-in required validation and a custom validation that only accepts the value '42'. Enter any other number to see the custom error, then click Report validity to trigger and display the validation message. Leave the field empty to see the required validation message after clicking 'Report validity' button."
          label="Number">
          <sl-number-field @sl-validate=${onValidate} required></sl-number-field>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};
export const StepButtonsEnd = {
  args: {
    ...Basic.args,
    stepButtons: 'end'
  }
};
export const StepButtonsEdges = {
  args: {
    ...Basic.args,
    stepButtons: 'edges'
  }
};
export const All = {
  render: () => html`
    <style>
      .wrapper {
        align-items: center;
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: auto 1fr 1fr;
      }
    </style>
    <div class="wrapper">
      <span></span>
      <span style="justify-self: center">md</span>
      <span style="justify-self: center">lg</span>

      <span>Empty</span>
      <sl-number-field aria-label="Number field" placeholder="Placeholder"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"></sl-number-field>

      <span>Value</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        value="100"></sl-number-field>

      <span>Disabled</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"></sl-number-field>

      <span>Disabled with value</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        value="100"></sl-number-field>

      <span>Readonly</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        readonly
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        readonly
        size="lg"
        value="100"></sl-number-field>

      <span>Empty, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="end"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"></sl-number-field>

      <span>Value, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="end"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
        value="100"></sl-number-field>

      <span>Disabled, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="end"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"></sl-number-field>

      <span>Disabled with value, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="end"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
        value="100"></sl-number-field>

      <span>Empty, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="edges"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"></sl-number-field>

      <span>Value, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="edges"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
        value="100"></sl-number-field>

      <span>Disabled, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="edges"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"></sl-number-field>

      <span>Disabled with value, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="edges"
        value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
        value="100"></sl-number-field>
    </div>
  `
};
//# sourceMappingURL=number-field.stories.js.map
