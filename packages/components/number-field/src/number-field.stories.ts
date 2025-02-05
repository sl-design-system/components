import '@sl-design-system/form/register.js';
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
    valueAsNumber: 5
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
  } // TODO: rangeOverflow is not working?
  // TODO: min max is not working with text input, maybe use pattern?
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner,
      div {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .examples {
        gap: 1.62rem;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
        padding: 1rem;
      }

      .my-heading {
        font-size: 1.3rem;
        font-weight: 600;
        gap: 16px;
      }

      .badges {
        flex-direction: row;
        gap: 8px;
      }
    </style>
    <section>
      <div class="examples">
        <h2>Size: md</h2>
        <sl-number-field size="md" placeholder="Placeholder"></sl-number-field>
        <sl-number-field size="md" placeholder="Placeholder" valueAsNumber="100"></sl-number-field>
        <sl-number-field disabled size="md" placeholder="Placeholder"></sl-number-field>
        <sl-number-field disabled size="md" placeholder="Placeholder" valueAsNumber="100"></sl-number-field>
      </div>
      <div class="examples">
        <h2>Size: lg</h2>
        <sl-number-field size="lg" placeholder="Placeholder"></sl-number-field>
        <sl-number-field size="lg" placeholder="Placeholder" valueAsNumber="100"></sl-number-field>
        <sl-number-field disabled size="lg" placeholder="Placeholder"></sl-number-field>
        <sl-number-field disabled size="lg" placeholder="Placeholder" valueAsNumber="100"></sl-number-field>
      </div>
    </section>
  `
};

// TODO: disabled, readonly, required and so on...step buttons end, edges

// TODO: sizes story

// TODO: all

// TODO: example with validation on blur???
