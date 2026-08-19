import '@sl-design-system/button/register.js';
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
  | 'shape'
  | 'size'
  | 'start'
  | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
  width?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Time field',
  args: {
    disabled: false,
    label: 'Time',
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
    reportValidity: { table: { disable: true } },
    shape: {
      control: 'inline-radio',
      options: ['rect', 'pill']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
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
    shape,
    size,
    start,
    value,
    width
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    reportValidity = reportValidity ?? true;

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-time-field
            style="inline-size: ${width ? width : 'fit-content'};"
            ?disabled=${disabled}
            hour-step=${ifDefined(hourStep)}
            locale=${ifDefined(locale)}
            max=${ifDefined(max)}
            min=${ifDefined(min)}
            minute-step=${ifDefined(minuteStep)}
            placeholder=${ifDefined(placeholder)}
            ?readonly=${readonly}
            ?required=${required}
            shape=${ifDefined(shape)}
            size=${ifDefined(size)}
            start=${ifDefined(start)}
            .value=${value}></sl-time-field>
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

export const Pill: Story = {
  args: {
    shape: 'pill',
    value: '13:30'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Placeholder: Story = {
  args: {
    placeholder: 'Add a time',
    hint: "We format the time, so you probably don't have to explain anything to the user in a placeholder. If you want you can set a custom placeholder, but be careful you are not degrading the user experience by doing so."
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

export const ExplicitWidth: Story = {
  args: {
    hint: 'This field has been set to a width of 250px',
    width: '250px'
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

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          grid-template-columns: auto minmax(200px, 1fr) minmax(200px, 1fr);
          gap: 1rem;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center">md</span>
        <span style="justify-self: center">lg</span>

        <span>Basic</span>
        <sl-time-field aria-label="Medium time field"></sl-time-field>
        <sl-time-field size="lg" aria-label="Large time field"></sl-time-field>

        <span>With value</span>
        <sl-time-field value="13:30" aria-label="Medium time field with value"></sl-time-field>
        <sl-time-field
          value="13:30"
          size="lg"
          aria-label="Large time field with value"></sl-time-field>

        <span>Required</span>
        <sl-time-field required aria-label="Medium required time field"></sl-time-field>
        <sl-time-field size="lg" required aria-label="Large required time field"></sl-time-field>

        <span>Disabled</span>
        <sl-time-field disabled aria-label="Medium disabled time field"></sl-time-field>
        <sl-time-field size="lg" disabled aria-label="Large disabled time field"></sl-time-field>

        <span>Readonly</span>
        <sl-time-field
          readonly
          value="13:30"
          aria-label="Medium readonly time field"></sl-time-field>
        <sl-time-field
          size="lg"
          readonly
          value="13:30"
          aria-label="Large readonly time field"></sl-time-field>

        <span>Placeholder</span>
        <sl-time-field
          placeholder="Add a time"
          aria-label="Medium time field with placeholder"></sl-time-field>
        <sl-time-field
          size="lg"
          placeholder="Add a time"
          aria-label="Large time field with placeholder"></sl-time-field>

        <span>Pill</span>
        <sl-time-field shape="pill" aria-label="Medium pill time field"></sl-time-field>
        <sl-time-field size="lg" shape="pill" aria-label="Large pill time field"></sl-time-field>

        <span>Pill with value</span>
        <sl-time-field
          shape="pill"
          value="13:30"
          aria-label="Medium pill time field with value"></sl-time-field>
        <sl-time-field
          size="lg"
          shape="pill"
          value="13:30"
          aria-label="Large pill time field with value"></sl-time-field>
      </div>
    `;
  }
};
