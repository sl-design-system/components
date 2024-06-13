import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type NumberField } from './number-field.js';

type Props = Pick<
  NumberField,
  'disabled' | 'inputSize' | 'placeholder' | 'readonly' | 'required' | 'stepper' | 'value' | 'valueAsNumber'
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
  render: ({ disabled, label, hint, inputSize, placeholder, readonly, required, stepper, value, valueAsNumber }) => {
    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-number-field
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?required=${required}
            ?stepper=${stepper}
            .inputSize=${inputSize}
            .placeholder=${placeholder}
            .value=${value}
            .valueAsNumber=${valueAsNumber}
          ></sl-number-field>
        </sl-form-field>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    stepper: true,
    valueAsNumber: 1024
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Readonly: Story = {
  args: {
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
