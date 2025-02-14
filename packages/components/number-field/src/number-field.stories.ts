import '@sl-design-system/form/register.js';
import { type TextFieldSize } from '@sl-design-system/text-field';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type NumberField, StepButtonsPlacement } from './number-field.js';

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
  | 'value'
  | 'valueAsNumber'
> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

const stepButtonsPlacements: StepButtonsPlacement[] = ['end', 'edges'];

const sizes: TextFieldSize[] = ['md', 'lg'];

export default {
  title: 'Form/Number field',
  tags: ['draft'],
  args: {
    inputSize: 8,
    label: 'Number'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    stepButtons: {
      control: 'inline-radio',
      options: stepButtonsPlacements
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
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
    value,
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
            .inputSize=${inputSize}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .size=${size}
            .step=${step}
            .stepButtons=${stepButtons}
            .valueAsNumber=${valueAsNumber}
            locale=${ifDefined(locale)}
            value=${ifDefined(value)}
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

export const NoStepButtons: Story = {
  args: {
    ...Basic.args,
    hint: 'The step buttons are hidden, you can still use the keyboard to increase or decrease the value.',
    stepButtons: undefined
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

export const OnBlur: Story = {
  render: ({ min }) => {
    const onBlur = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <style>
        #root-inner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: start;
        }
      </style>
      <sl-form>
        <sl-form-field hint="The value should be of maximum 8" label="Number label">
          <sl-number-field
            @sl-blur=${onBlur}
            size="md"
            placeholder="Placeholder"
            required
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
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: start;
      }

      section {
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        gap: 3rem;
        align-items: center;
      }
    </style>
    <section>
      <span></span>
      <h2>Size: md</h2>
      <h2>Size: lg</h2>

      <h3>Empty</h3>
      <sl-number-field size="md" placeholder="Placeholder" aria-label="Number field"></sl-number-field>
      <sl-number-field size="lg" placeholder="Placeholder" aria-label="Number field"></sl-number-field>

      <h3>Value</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Disabled</h3>
      <sl-number-field disabled size="md" placeholder="Placeholder" aria-label="Number field"></sl-number-field>
      <sl-number-field disabled size="lg" placeholder="Placeholder" aria-label="Number field"></sl-number-field>

      <h3>Disabled with value</h3>
      <sl-number-field
        disabled
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        disabled
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Readonly</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        readonly
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        readonly
        valueAsNumber="100"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Empty, step buttons: end</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Value, step buttons: end</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Disabled, step buttons: end</h3>
      <sl-number-field
        disabled
        size="md"
        placeholder="Placeholder"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        disabled
        size="lg"
        placeholder="Placeholder"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Disabled with value, step buttons: end</h3>
      <sl-number-field
        disabled
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        disabled
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="end"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Empty, step buttons: edges</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Value, step buttons: edges</h3>
      <sl-number-field
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Disabled, step buttons: edges</h3>
      <sl-number-field
        disabled
        size="md"
        placeholder="Placeholder"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        disabled
        size="lg"
        placeholder="Placeholder"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>

      <h3>Disabled with value, step buttons: edges</h3>
      <sl-number-field
        disabled
        size="md"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>
      <sl-number-field
        disabled
        size="lg"
        placeholder="Placeholder"
        valueAsNumber="100"
        step-buttons="edges"
        aria-label="Number field"
      ></sl-number-field>
    </section>
  `
};
