import '@sl-design-system/button/register.js';
import '@sl-design-system/form/register.js';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
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
    value,
    width
  }) => {
    const onClick = event => {
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
            start=${ifDefined(start)}
            .value=${value}></sl-time-field>
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
export const Basic = {};
export const Disabled = {
  args: {
    disabled: true
  }
};
export const Placeholder = {
  args: {
    placeholder: 'Add a time',
    hint: "We format the time, so you probably don't have to explain anything to the user in a placeholder. If you want you can set a custom placeholder, but be careful you are not degrading the user experience by doing so."
  }
};
export const Finnish = {
  args: {
    hint: 'In Finnish (fi) the time separator is a dot (.)',
    locale: 'fi',
    value: '13.30'
  }
};
export const MinMax = {
  args: {
    hint: 'The allowed time range is between 08:40 and 18:20',
    min: '08:40',
    max: '18:20',
    start: '09:00'
  }
};
export const Readonly = {
  args: {
    readonly: true,
    value: '13:30'
  }
};
export const Required = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button',
    reportValidity: true,
    required: true
  }
};
export const ExplicitWidth = {
  args: {
    hint: 'This field has been set to a width of 250px',
    width: '250px'
  }
};
export const Start = {
  args: {
    hint: 'The start time is set to 08:00, so that will be the default time shown when opening the listbox',
    start: '08:00'
  }
};
export const Steps = {
  args: {
    hint: 'This is an example of a time field with custom hour and minute steps',
    hourStep: 2,
    minuteStep: 10
  }
};
export const Value = {
  args: {
    value: '13:30'
  }
};
//# sourceMappingURL=time-field.stories.js.map
