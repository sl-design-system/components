import type { Switch, SwitchOrientation, SwitchSize } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/icon/register.js';
import { faRabbitRunning, faTurtle } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import '../register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;
  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

interface Props extends Pick<Switch, 'checked' | 'disabled' | 'value' | 'size' | 'hint'> {
  label: string;
}

type Story = StoryObj<Props>;

const sizes: SwitchSize[] = ['sm', 'md', 'lg'];
const orientations: SwitchOrientation[] = ['horizontal', 'vertical'];
const states: string[] = ['', 'checked'];

const sizeName = (size: SwitchSize): string => {
  switch (size) {
    case 'sm':
      return 'Small';
    case 'md':
      return 'Medium';
    case 'lg':
      return 'Large';
  }
};

export default {
  title: 'Switch',
  args: {
    checked: false,
    disabled: false,
    value: '12345',
    size: 'md',
    hint: 'Something to help the user out',
    label: 'Label for the switch'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({ checked, disabled, value, size, hint, label }) => html`
    <sl-switch ?checked=${checked} ?disabled=${disabled} .value=${value} .size=${size} .hint=${hint}
      >${label}</sl-switch
    >
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    return html` <style>
        sl-switch {
          min-width: 250px;
        }
        tbody th,
        tbody td {
          vertical-align: top;
        }
        td > div {
          display: inline-flex;
          flex-direction: column;
          gap: 8px;
        }

        tbody td:nth-of-type(2n) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        tbody td:nth-of-type(2n + 1):not(:first-of-type) {
          padding-left: 24px;
        }
        tbody td:last-of-type {
          border: none;
        }
        sl-switch:not(:last-of-type) {
          border-bottom: 1px solid #efefef;
          padding-bottom: 8px;
        }
      </style>
      <table>
        <thead>
          <tr>
            <td></td>
            ${sizes.map(size => html` <th colspan="2">Size: ${sizeName(size)}</th> `)}
          </tr>
        </thead>
        <tbody>
          ${orientations.map(
            orientation =>
              html`<tr>
                <th>${orientation}</th>
                ${sizes.map(size =>
                  states.map(
                    state => html`
                      <td>
                        <div>
                          <sl-switch
                            .size=${size}
                            .orientation=${orientation}
                            ?checked=${state === 'checked'}
                            hint="Check this one"
                            >With hint</sl-switch
                          >
                          <sl-switch .size=${size} .orientation=${orientation} ?checked=${state === 'checked'}
                            >Without hint</sl-switch
                          >
                          <sl-switch
                            .size=${size}
                            .orientation=${orientation}
                            ?checked=${state === 'checked'}
                          ></sl-switch>
                        </div>
                      </td>
                    `
                  )
                )}
              </tr>`
          )}
        </tbody>
      </table>`;
  }
};

export const CustomIcons: Story = {
  render: () => {
    Icon.registerIcon(faTurtle, faRabbitRunning);
    return html` ${sizes.map(
      size => html` <sl-switch .size=${size} iconOff="far-turtle" iconOn="far-rabbit-running"></sl-switch> `
    )}`;
  }
};

export const ValidateInForm: Story = {
  render: () => {
    // setTimeout(() => document.querySelector('form')?.reportValidity());

    return html`
      <style>
        form {
          align-items: start;
          display: flex;
          flex-direction: column;
        }
        sl-label {
          margin-block-start: 0.5rem;
        }
        sl-label:first-of-type {
          margin-block-start: 0;
        }
        sl-button-bar,
        sl-input,
        sl-textarea {
          align-self: stretch;
        }
      </style>
      <form @submit=${onSubmit}>
        <sl-label for="group">Switch</sl-label>
        <sl-switch required name="newletter" value="subscribe">Subscribed to the newsletter</sl-switch>
        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit">Submit</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};
