import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type NumberField } from './number-field.js';

type Props = Pick<
  NumberField,
  | 'disabled'
  | 'inputSize'
  | 'locale'
  | 'noStepButtons'
  | 'placeholder'
  | 'readonly'
  | 'required'
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
  },
  argTypes: {
    locale: {
      control: 'inline-radio',
      options: ['de', 'en', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
    }
  },
  render: ({
    disabled,
    label,
    hint,
    inputSize,
    locale,
    noStepButtons,
    placeholder,
    readonly,
    required,
    value,
    valueAsNumber
  }) => {
    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-number-field
            ?disabled=${disabled}
            ?no-step-buttons=${noStepButtons}
            ?readonly=${readonly}
            ?required=${required}
            .inputSize=${inputSize}
            .placeholder=${placeholder}
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

export const NoStepButtons: Story = {
  args: {
    ...Basic.args,
    hint: 'The step buttons are hidden, you can still use the keyboard to increase or decrease the value.',
    noStepButtons: true
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
