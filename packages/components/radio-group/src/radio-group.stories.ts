import type { RadioGroup } from './radio-group.js';
import type { RadioButtonSize } from './radio.js';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import { html } from 'lit';
import '../register.js';

type Props = Pick<RadioGroup, 'disabled' | 'horizontal' | 'required' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  options?: TemplateResult;
  slot?: () => TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: RadioButtonSize[] = ['md', 'lg'];

export default {
  title: 'Radio group',
  args: {
    disabled: false,
    horizontal: false,
    label: 'Label',
    required: false,
    size: 'md',
    value: null
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    value: {
      control: 'text'
    }
  },
  render: ({ disabled, hint, horizontal, label, options, required, slot, value, size }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-radio-group
              ?disabled=${disabled}
              ?horizontal=${horizontal}
              ?required=${required}
              .size=${size}
              .value=${value}
            >
              ${options ??
              html`
                <sl-radio value="1">One</sl-radio>
                <sl-radio value="2">Two</sl-radio>
                <sl-radio value="3">Three</sl-radio>
              `}
            </sl-radio-group>
          `}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
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

export const Horizontal: Story = {
  args: {
    horizontal: true
  }
};

export const Overflow: Story = {
  args: {
    options: html`
      <sl-radio>Lorem ipsum</sl-radio>
      <sl-radio>
        Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea
      </sl-radio>
      <sl-radio>
        Amet consequat veniam nostrud labore. Labore labore sunt in nisi ut voluptate cillum. Consequat ex dolor nostrud
        duis veniam ut est. Commodo dolor incididunt laborum cupidatat anim magna voluptate Lorem eu elit eiusmod mollit
        irure.
      </sl-radio>
    `
  }
};

export const Required: Story = {
  args: {
    hint: "This field is required, if you don't select an option, you will see an error message when clicking the button.",
    required: true
  }
};

export const Valid: Story = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.'
  }
};

export const Value: Story = {
  args: {
    value: '2'
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to pick the middle option to make the field valid. The custom validation is done by listening to the sl-change event and setting the custom validity on the radio group. If you never select any option, then only the builtin validation applies.',
    slot: () => {
      const onValidate = (event: Event & { target: RadioGroup }): void => {
        event.target.setCustomValidity(event.target.value === '2' ? '' : 'Pick the middle option');
      };

      return html`
        <sl-radio-group @sl-validate=${onValidate} required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to pick the middle option to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = (event: Event & { target: RadioGroup }): void => {
        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value === '2' ? '' : 'Pick the middle option'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-radio-group @sl-validate=${onValidate} required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      `;
    }
  }
};

export const All: StoryObj = {
  render: () => {
    const checked = ['', 'checked'],
      states = ['', 'valid', 'invalid'];

    return html`
      <style>
        table {
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          text-transform: capitalize;
        }
        th,
        td {
          padding: 4px 8px;
        }
        thead td {
          text-align: center;
        }

        tbody td:nth-of-type(4n + 5) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        tbody td:nth-of-type(4n + 2):not(:first-of-type) {
          padding-left: 24px;
        }
        tbody td:last-of-type {
          border: none;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            ${sizes.map(size => html`<th colspan=${states.length + 1}>Size: ${size}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${checked.map(
            c =>
              html` <tr>
                <td>${c}</td>
                ${sizes.map(
                  size =>
                    html` <td>
                        <sl-radio ?checked=${c === 'checked'} size=${size} data-mock-state>Label </sl-radio>
                      </td>
                      <td>
                        <sl-radio ?checked=${c === 'checked'} show-validity="valid" size=${size} data-mock-state
                          >Label
                        </sl-radio>
                      </td>
                      <td>
                        <sl-radio ?checked=${c === 'checked'} show-validity="invalid" size=${size} data-mock-state
                          >Label
                        </sl-radio>
                      </td>
                      <td>
                        <sl-radio ?checked=${c === 'checked'} size=${size} disabled data-mock-state>Label </sl-radio>
                      </td>`
                )}
              </tr>`
          )}
        </tbody>
      </table>
    `;
  }
};
