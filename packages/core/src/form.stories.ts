import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button/register.js';
import './button-bar/register.js';
import './checkbox/register.js';
import './input/register.js';
import './label/register.js';
import './radio-group/register.js';
import './textarea/register.js';

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
      sl-button-bar {
        grid-column: 1 / 3;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="input">Input</sl-label>
      <sl-input id="input" name="input" placeholder="Placeholder"></sl-input>

      <sl-label for="textarea">Textarea</sl-label>
      <sl-textarea id="textarea" name="textarea" placeholder="Placeholder"></sl-textarea>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>

      <sl-label for="radio-group">Radio group</sl-label>
      <sl-radio-group id="radio-group" name="radioGroup">
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>

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
      sl-label {
        margin-bottom: 0.25rem;
      }
      sl-label:not(:first-of-type) {
        margin-top: 1rem;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="input">Input</sl-label>
      <sl-input id="input" name="input" placeholder="Placeholder"></sl-input>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>

      <sl-label for="radio-group">Radio group</sl-label>
      <sl-radio-group id="radio-group" name="radioGroup">
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>

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
        align-items: start;
        display: flex;
        flex-direction: column;
      }
      sl-label {
        margin-bottom: 0.25rem;
      }
      sl-label:not(:first-of-type) {
        margin-top: 1rem;
      }
      sl-input,
      sl-button-bar {
        align-self: stretch;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="input">Label for the input</sl-label>
      <sl-input id="input" minlength="8" name="input" placeholder="Type at least 8 characters here" required></sl-input>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" name="checkbox" required value="checkbox">I am required</sl-checkbox>

      <sl-label for="radio-group">Radio group</sl-label>
      <sl-radio-group id="radio-group" name="radioGroup">
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>

      <sl-button-bar align="end">
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};
