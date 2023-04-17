import type { Switch } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;
  console.log(data, output);
  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

type Props = Pick<Switch, 'checked' | 'disabled' | 'value' | 'size' | 'hint'>;

export default {
  title: 'Switch',
  args: {
    checked: false,
    disabled: false,
    value: '12345',
    size: 'md',
    hint: 'Something to help the user out'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  render: ({ checked, disabled, value, size, hint }) => html`
    <sl-switch ?checked=${checked} ?disabled=${disabled} .value=${value} .size=${size} .hint=${hint}></sl-switch>
  `
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};

export const ValidateInForm: StoryObj = {
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
        <sl-switch required name="newletter" value="subscribe"></sl-switch>
        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit">Submit</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};
