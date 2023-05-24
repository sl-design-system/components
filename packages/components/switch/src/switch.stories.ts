import type { Switch, SwitchSize } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/icon/register.js';
import { faRabbitRunning, faTurtle } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
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

type Story = StoryObj<Props>;

const sizes: SwitchSize[] = ['sm', 'md', 'lg'];

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
        #root-inner {
          align-items: start;
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr 1fr;
        }
        h2 {
          grid-column-end: -1;
          grid-column-start: 1;
        }
      </style>
      ${sizes.map(
        size => html`
          <h2>${sizeName(size)}</h2>
          <sl-switch .size=${size} hint="Check this one">Unchecked</sl-switch>
          <sl-switch .size=${size} checked>Checked</sl-switch>
          <sl-switch .size=${size} disabled>Disabled unchecked</sl-switch>
          <sl-switch .size=${size} disabled checked>Disabled checked</sl-switch>
          <sl-switch .size=${size}></sl-switch>
          <sl-switch .size=${size} checked></sl-switch>
        `
      )}`;
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
