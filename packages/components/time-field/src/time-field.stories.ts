import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type TimeField } from './time-field.js';

type Props = Pick<
  TimeField,
  'disabled' | 'hourStep' | 'max' | 'min' | 'minuteStep' | 'placeholder' | 'readonly' | 'required' | 'start' | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Time field',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Time',
    placeholder: 'Select time',
    readonly: false,
    required: false,
    value: ''
  },
  argTypes: {
    hint: { table: { disable: true } },
    label: { table: { disable: true } },
    reportValidity: { table: { disable: true } }
  },
  render: ({ disabled, hint, label, max, min, placeholder, readonly, reportValidity, required, start, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-time-field
            ?disabled=${disabled}
            max=${ifDefined(max)}
            min=${ifDefined(min)}
            placeholder=${ifDefined(placeholder)}
            ?readonly=${readonly}
            ?required=${required}
            start=${ifDefined(start)}
            value=${ifDefined(value)}
          ></sl-time-field>
        </sl-form-field>
        ${reportValidity
          ? html`
              <sl-button-bar>
                <sl-button @click=${onClick}>Report validity</sl-button>
              </sl-button-bar>
            `
          : nothing}
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const MinMax: Story = {
  args: {
    hint: 'The allowed time range is between 09:00 and 18:00',
    min: '09:00',
    max: '18:00'
  }
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: '13:30'
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button',
    reportValidity: true,
    required: true
  }
};

export const Start: Story = {
  args: {
    hint: 'The start time is set to 08:00, so that will be the default time shown when opening the listbox',
    start: '08:00'
  }
};

export const Value: Story = {
  args: {
    value: '13:30'
  }
};
