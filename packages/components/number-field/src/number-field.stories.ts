import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type NumberField } from './number-field.js';

type Props = Pick<
  NumberField,
  | 'stepButtons'
  | 'disabled'
  | 'formatOptions'
  | 'inputSize'
  | 'locale'
  | 'max'
  | 'min'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'size'
  | 'step'
  | 'valueAsNumber'
> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Number field',
  tags: ['draft'],
  args: {
    inputSize: 8,
    label: 'Number'
  },
  argTypes: {
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
    required,
    size,
    step,
    stepButtons,
    valueAsNumber
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
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
            step-buttons=${ifDefined(stepButtons)}
          ></sl-number-field>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    valueAsNumber: 1024
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const FormatCurrency: Story = {
  args: {
    formatOptions: { style: 'currency', currency: 'EUR' },
    hint: 'The number is formatted as currency.',
    step: 0.01,
    valueAsNumber: 9.9
  }
};

export const FormatPercent: Story = {
  args: {
    formatOptions: { style: 'percent', maximumFractionDigits: 2 },
    hint: 'The number is formatted as a percentage.',
    step: 0.01,
    valueAsNumber: 10
  }
};

export const FormatUnit: Story = {
  args: {
    formatOptions: { style: 'unit', unit: 'meter', unitDisplay: 'long' },
    hint: 'The number is formatted as a unit.',
    inputSize: 10,
    valueAsNumber: 100
  }
};

export const MinMax: Story = {
  args: {
    hint: 'The number must be between 0 and 10.',
    max: 10,
    min: 0,
    valueAsNumber: 50
  }
};

export const Readonly: Story = {
  args: {
    ...Basic.args,
    hint: 'The field is readonly, you can focus it, but you cannot enter any text.',
    readonly: true
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    max: 10,
    required: true
  }
};

export const StepButtonsEnd: Story = {
  args: {
    ...Basic.args,
    stepButtons: 'end'
  }
};

export const StepButtonsEdges: Story = {
  args: {
    ...Basic.args,
    stepButtons: 'edges'
  }
};

export const OnBlur: Story = {
  render: ({ min }) => {
    const onBlur = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field hint="The value should be of maximum 8" label="Number label">
          <sl-number-field
            @sl-blur=${onBlur}
            input-size="20"
            placeholder="Placeholder"
            required
            size="md"
            .min=${min}
            max="8"
          ></sl-number-field>
        </sl-form-field>
      </sl-form>
    `;
  }
};

export const All: Story = {
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
      <sl-number-field aria-label="Number field" placeholder="Placeholder" size="lg"></sl-number-field>

      <span>Value</span>
      <sl-number-field aria-label="Number field" placeholder="Placeholder" value="100"></sl-number-field>
      <sl-number-field aria-label="Number field" placeholder="Placeholder" size="lg" value="100"></sl-number-field>

      <span>Disabled</span>
      <sl-number-field aria-label="Number field" disabled placeholder="Placeholder"></sl-number-field>
      <sl-number-field aria-label="Number field" disabled placeholder="Placeholder" size="lg"></sl-number-field>

      <span>Disabled with value</span>
      <sl-number-field aria-label="Number field" disabled placeholder="Placeholder" value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        value="100"
      ></sl-number-field>

      <span>Readonly</span>
      <sl-number-field aria-label="Number field" placeholder="Placeholder" readonly value="100"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        readonly
        size="lg"
        value="100"
      ></sl-number-field>

      <span>Empty, step buttons: end</span>
      <sl-number-field aria-label="Number field" placeholder="Placeholder" step-buttons="end"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
      ></sl-number-field>

      <span>Value, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="end"
        value="100"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
        value="100"
      ></sl-number-field>

      <span>Disabled, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="end"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
      ></sl-number-field>

      <span>Disabled with value, step buttons: end</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="end"
        value="100"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="end"
        value="100"
      ></sl-number-field>

      <span>Empty, step buttons: edges</span>
      <sl-number-field aria-label="Number field" placeholder="Placeholder" step-buttons="edges"></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
      ></sl-number-field>

      <span>Value, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        step-buttons="edges"
        value="100"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
        value="100"
      ></sl-number-field>

      <span>Disabled, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="edges"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
      ></sl-number-field>

      <span>Disabled with value, step buttons: edges</span>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        step-buttons="edges"
        value="100"
      ></sl-number-field>
      <sl-number-field
        aria-label="Number field"
        disabled
        placeholder="Placeholder"
        size="lg"
        step-buttons="edges"
        value="100"
      ></sl-number-field>
    </div>
  `
};
