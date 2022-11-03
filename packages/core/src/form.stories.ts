import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button/register.js';
import './button-bar/register.js';
import './checkbox/register.js';
import './input/register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

export default {
  title: 'Forms'
};

export const Horizontal: StoryObj = {
  render: () => html`
    <style>
      form {
        display: grid;
        gap: 1rem 0.25rem;
        grid-template-columns: auto 1fr;
      }
      label {
        grid-column: 1;
      }
      sl-button-bar {
        grid-column: 1 / 3;
      }
    </style>
    <form @submit=${onSubmit}>
      <label for="input">Input</label>
      <sl-input id="input" name="input" placeholder="Placeholder"></sl-input>

      <label for="checkbox">Checkbox</label>
      <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>

      <sl-button-bar align="end">
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const Vertical: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 0.25rem;
      }
      label:not(:first-of-type) {
        margin-top: 1rem;
      }
    </style>
    <form @submit=${onSubmit}>
      <label for="input">Input</label>
      <sl-input id="input" name="input" placeholder="Placeholder"></sl-input>

      <label for="checkbox">Checkbox</label>
      <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>

      <sl-button-bar align="end">
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const Validation: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 0.25rem;
      }
      label:not(:first-of-type) {
        margin-top: 1rem;
      }
      label:has(+ [required])::after {
        content: ' *';
      }
    </style>
    <form @submit=${onSubmit}>
      <label for="input">Label for the input</label>
      <sl-input id="input" name="input" placeholder="This is a placeholder" required></sl-input>

      <label for="checkbox">Checkbox</label>
      <sl-checkbox id="checkbox" name="checkbox" required value="checkbox">I am required</sl-checkbox>

      <sl-button-bar align="end">
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};
