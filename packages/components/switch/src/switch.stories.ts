import type { Switch } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;
  console.log(data, output);
  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

interface Props extends Pick<Switch, 'checked' | 'disabled' | 'value' | 'size' | 'hint'> {
  label: string;
}

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
      options: ['md', 'lg']
    }
  },
  render: ({ checked, disabled, value, size, hint, label }) => html`
    <sl-switch ?checked=${checked} ?disabled=${disabled} .value=${value} .size=${size} .hint=${hint}
      >${label}</sl-switch
    >
  `
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    return html`
      <style>
        #root-inner {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      </style>
      <sl-switch>Unchecked</sl-switch>
      <sl-switch checked>Checked</sl-switch>
      <sl-switch disabled>Disabled unchecked</sl-switch>
      <sl-switch disabled checked>Disabled checked</sl-switch>
    `;
  }
};

export const ValidateInForm: Story = {
  render: () => {
    setTimeout(() => document.querySelector('form')?.reportValidity());

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
