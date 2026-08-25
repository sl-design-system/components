import '@sl-design-system/form/register.js';
import { html } from 'lit';
import '../register.js';
export default {
  title: 'Form/Text area',
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Type something here',
    readonly: false,
    required: false,
    resize: 'vertical',
    showValid: false,
    size: 'md',
    value: '',
    wrap: 'soft'
  },
  argTypes: {
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'auto']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    value: {
      control: 'text'
    },
    wrap: {
      control: 'inline-radio',
      options: ['soft', 'hard']
    }
  },
  render: ({
    disabled,
    label,
    hint,
    maxLength,
    minLength,
    placeholder,
    required,
    showCount,
    showValid,
    size,
    resize,
    readonly,
    rows,
    slot,
    value,
    wrap
  }) => {
    const onClick = event => {
      event.target.closest('sl-form')?.reportValidity();
    };
    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${
            slot?.() ??
            html`
              <sl-text-area
                ?disabled=${disabled}
                ?readonly=${readonly}
                ?required=${required}
                .maxLength=${maxLength}
                .minLength=${minLength}
                .placeholder=${placeholder ?? ''}
                .resize=${resize}
                .rows=${rows}
                .showCount=${showCount}
                .showValid=${showValid}
                .size=${size}
                .value=${value}
                .wrap=${wrap}></sl-text-area>
            `
          }
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
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
export const MinMaxLength = {
  args: {
    hint: "This field requires a minimum of 3 and a maximum of 5 characters. The browser won't report an error until you type at least 1 character.",
    minLength: 3,
    maxLength: 5
  }
};
export const Readonly = {
  args: {
    hint: 'The field is readonly, you can focus it, but you cannot enter any text.',
    readonly: true
  }
};
export const Required = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    required: true
  }
};
export const Resize = {
  args: {
    hint: 'This field will resize automatically as you type. By default, the minimum height is determined by the rows attribute (default: 3).',
    resize: 'auto'
  }
};
export const Rows = {
  args: {
    hint: 'This field will have a specific number of rows. By default, the number of rows is 3. When the resize property is set to auto or vertical, the field will have a minimum height based on the number of rows.',
    rows: 4
  }
};
export const Valid = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.',
    showValid: true
  }
};
export const ShowCount = {
  args: {
    hint: 'A character counter is shown below the textarea. It turns orange when 90% of the limit is reached and red when you have exceeded the limit. Exceeding the limit does not block input \u2014 you can type or paste more and then edit it down.',
    showCount: 50,
    required: true
  }
};
export const CustomValidity = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to enter "SLDS" to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the textarea element.',
    slot: () => {
      const onValidate = event => {
        const value = event.target.value;
        event.target.setCustomValidity(value === 'SLDS' ? '' : 'Enter "SLDS"');
      };
      return html`<sl-text-area @sl-validate=${onValidate} required></sl-text-area>`;
    }
  }
};
export const CustomAsyncValidity = {
  args: {
    hint: 'This story has an async validator. You need to enter "SLDS" to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = event => {
        const promise = new Promise(resolve =>
          setTimeout(() => resolve(event.target.value === 'SLDS' ? '' : 'Enter "SLDS"'), 2e3)
        );
        event.target.setCustomValidity(promise);
      };
      return html`<sl-text-area @sl-validate=${onValidate} required></sl-text-area>`;
    }
  }
};
export const All = {
  render: () => {
    return html`
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
        <sl-text-area placeholder="Placeholder"></sl-text-area>
        <sl-text-area placeholder="Placeholder" size="lg"></sl-text-area>

        <span>Value</span>
        <sl-text-area aria-label="Text area" value="Value"></sl-text-area>
        <sl-text-area aria-label="Text area" size="lg" value="Value"></sl-text-area>

        <span>Invalid</span>
        <sl-text-area aria-label="Text area" show-validity="invalid" value="Invalid"></sl-text-area>
        <sl-text-area
          aria-label="Text area"
          show-validity="invalid"
          size="lg"
          value="Invalid"></sl-text-area>

        <span>Valid</span>
        <sl-text-area aria-label="Text area" show-validity="valid" value="Valid"></sl-text-area>
        <sl-text-area
          aria-label="Text area"
          show-validity="valid"
          size="lg"
          value="Valid"></sl-text-area>

        <span>Readonly</span>
        <sl-text-area aria-label="Text area" readonly value="Value"></sl-text-area>
        <sl-text-area aria-label="Text area" readonly size="lg" value="Value"></sl-text-area>

        <span>Disabled</span>
        <sl-text-area aria-label="Text area" disabled value="Value"></sl-text-area>
        <sl-text-area aria-label="Text area" disabled size="lg" value="Value"></sl-text-area>
      </div>
    `;
  }
};
//# sourceMappingURL=text-area.stories.js.map
