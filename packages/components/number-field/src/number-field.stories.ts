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
  | 'step'
  | 'value'
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
    inputSize: 6,
    label: 'Number'
    // controls: undefined,
  },
  argTypes: {
    stepButtons: {
      control: 'inline-radio',
      options: ['undefined', 'end', 'edges']
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
    step,
    stepButtons,
    value,
    valueAsNumber
  }) => {
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
            .step=${step}
            .stepButtons=${stepButtons}
            .valueAsNumber=${valueAsNumber}
            locale=${ifDefined(locale)}
            value=${ifDefined(value)}
          ></sl-number-field>
        </sl-form-field>
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
    valueAsNumber: 9.9
  }
};

export const FormatPercent: Story = {
  args: {
    formatOptions: { style: 'percent' },
    hint: 'The number is formatted as a percentage.',
    step: 0.01,
    valueAsNumber: 0.1
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
    valueAsNumber: 5
  }
};

export const NoStepButtons: Story = {
  args: {
    ...Basic.args,
    hint: 'The step buttons are hidden, you can still use the keyboard to increase or decrease the value.'
    // noStepButtons: true
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
    required: true
  }
};

// TODO: sizes story
