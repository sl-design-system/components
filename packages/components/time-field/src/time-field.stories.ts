import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type TimeField } from './time-field.js';

type Props = Pick<
  TimeField,
  | 'disabled'
  | 'hourStep'
  | 'locale'
  | 'max'
  | 'min'
  | 'minuteStep'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'start'
  | 'value'
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
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv']
    },
    reportValidity: { table: { disable: true } }
  },
  render: ({
    disabled,
    hint,
    hourStep,
    label,
    locale,
    max,
    min,
    minuteStep,
    placeholder,
    readonly,
    reportValidity,
    required,
    start,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    reportValidity = reportValidity ?? true;

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-time-field
            ?disabled=${disabled}
            hour-step=${ifDefined(hourStep)}
            locale=${ifDefined(locale)}
            max=${ifDefined(max)}
            min=${ifDefined(min)}
            minute-step=${ifDefined(minuteStep)}
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

export const Finnish: Story = {
  args: {
    hint: 'In Finnish (fi) the time separator is a dot (.)',
    locale: 'fi',
    value: '13.30'
  }
};

export const MinMax: Story = {
  args: {
    hint: 'The allowed time range is between 08:40 and 18:20',
    min: '08:40',
    max: '18:20',
    start: '09:00'
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

export const Steps: Story = {
  args: {
    hint: 'This is an example of a time field with custom hour and minute steps',
    hourStep: 2,
    minuteStep: 10
  }
};

export const Value: Story = {
  args: {
    value: '13:30'
  }
};
