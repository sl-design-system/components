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

export const Form: StoryObj = {
  render: () => html`
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
    <form>
      <sl-label for="input">Input</sl-label>
      <sl-input id="input" name="input" placeholder="Placeholder"></sl-input>

      <sl-label for="textarea">Textarea</sl-label>
      <sl-textarea id="textarea" name="textarea" placeholder="Placeholder"></sl-textarea>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>

      <sl-label for="checkbox-group">Checkbox group</sl-label>
      <sl-checkbox-group id="checkbox-group" name="checkboxGroup">
        <sl-checkbox value="0">Check me</sl-checkbox>
        <sl-checkbox value="1">No me</sl-checkbox>
        <sl-checkbox value="2">I was here first</sl-checkbox>
      </sl-checkbox-group>

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

export const Hints: StoryObj = {
  render: () => html`
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
      <sl-label for="input">Input</sl-label>
      <sl-input id="input" hint="Hint for the text input." name="input" required></sl-input>

      <sl-label for="textarea">Textarea</sl-label>
      <sl-textarea id="textarea" hint="Hint for the textarea." name="textarea" required></sl-textarea>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" hint="Hint for the checkbox." name="checkbox" value="checkbox" required
        >Check me</sl-checkbox
      >

      <sl-label for="checkbox-group">Checkbox group</sl-label>
      <sl-checkbox-group id="checkbox-group" hint="Hint for the checkbox group." name="checkboxGroup" required>
        <sl-checkbox value="0">Check me</sl-checkbox>
        <sl-checkbox value="1">No me</sl-checkbox>
        <sl-checkbox value="2">I was here first</sl-checkbox>
      </sl-checkbox-group>

      <sl-label for="radio-group">Radio group</sl-label>
      <sl-radio-group id="radio-group" hint="Hint for the radio group." name="radioGroup" required>
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

export const ValidationRequired: StoryObj = {
  render: () => {
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
      <form>
        <sl-label for="input">Input</sl-label>
        <sl-input id="input" name="input" required></sl-input>

        <sl-label for="textarea">Textarea</sl-label>
        <sl-textarea id="textarea" name="textarea" required></sl-textarea>

        <sl-label for="inputEmail">Email</sl-label>
        <sl-input id="inputEmail" type="email" required></sl-input>

        <sl-label for="checkbox">Checkbox</sl-label>
        <sl-checkbox id="checkbox" name="checkbox" required value="checkbox">Checkbox</sl-checkbox>

        <sl-label for="checkbox-group">Checkbox group</sl-label>
        <sl-checkbox-group id="checkbox-group" name="checkboxGroup" required>
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>

        <sl-label for="radio-group">Radio group</sl-label>
        <sl-radio-group id="radio-group" name="radioGroup" required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>

        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit">Submit</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};

export const ValidationRequiredReport: StoryObj = {
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
      <form>
        <sl-label for="input">Input</sl-label>
        <sl-input id="input" name="input" required></sl-input>

        <sl-label for="textarea">Textarea</sl-label>
        <sl-textarea id="textarea" name="textarea" required></sl-textarea>

        <sl-label for="checkbox">Checkbox</sl-label>
        <sl-checkbox id="checkbox" name="checkbox" required value="checkbox">Checkbox</sl-checkbox>

        <sl-label for="checkbox-group">Checkbox group</sl-label>
        <sl-checkbox-group id="checkbox-group" name="checkboxGroup" required>
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>

        <sl-label for="radio-group">Radio group</sl-label>
        <sl-radio-group id="radio-group" name="radioGroup" required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </form>
    `;
  }
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
      <sl-label for="input">Label for the input</sl-label>
      <sl-input id="input" minlength="8" name="input" placeholder="Type at least 8 characters here" required></sl-input>

      <sl-label for="textarea">Textarea</sl-label>
      <sl-textarea
        id="textarea"
        minlength="8"
        name="textarea"
        placeholder="Type at least 8 characters here"
        required
      ></sl-textarea>

      <sl-label for="checkbox">Checkbox</sl-label>
      <sl-checkbox id="checkbox" name="checkbox" required value="checkbox">I am required</sl-checkbox>

      <sl-label for="checkbox-group">Checkbox group</sl-label>
      <sl-checkbox-group id="checkbox-group" name="checkboxGroup" required>
        <sl-checkbox value="0">Check me</sl-checkbox>
        <sl-checkbox value="1">No me</sl-checkbox>
        <sl-checkbox value="2">I was here first</sl-checkbox>
      </sl-checkbox-group>

      <sl-label for="radio-group">Radio group</sl-label>
      <sl-radio-group id="radio-group" name="radioGroup" required>
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

export const ValidationSizes: StoryObj = {
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
      <form>
        <h2>Small</h2>

        <sl-label for="input">Input</sl-label>
        <sl-input id="input" name="input" required error-size="sm"></sl-input>

        <sl-label for="textarea">Textarea</sl-label>
        <sl-textarea id="textarea" name="textarea" required error-size="sm"></sl-textarea>

        <sl-label for="checkbox">Checkbox</sl-label>
        <sl-checkbox id="checkbox" name="checkbox" required value="checkbox" error-size="sm">Checkbox</sl-checkbox>

        <sl-label for="checkbox-group">Checkbox group</sl-label>
        <sl-checkbox-group id="checkbox-group" name="checkboxGroup" required error-size="sm">
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>

        <sl-label for="radio-group">Radio group</sl-label>
        <sl-radio-group id="radio-group" name="radioGroup" required error-size="sm">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>

        <h2>Medium</h2>

        <sl-label for="input2">Input</sl-label>
        <sl-input id="input2" name="input" required error-size="md"></sl-input>

        <sl-label for="textarea2">Textarea</sl-label>
        <sl-textarea id="textarea2" name="textarea2" required error-size="md"></sl-textarea>

        <sl-label for="checkbox2">Checkbox</sl-label>
        <sl-checkbox id="checkbox2" name="checkbox2" required value="checkbox" error-size="md">Checkbox</sl-checkbox>

        <sl-label for="checkbox-group2">Checkbox group</sl-label>
        <sl-checkbox-group id="checkbox-group2" name="checkboxGroup2" required error-size="md">
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>

        <sl-label for="radio-group2">Radio group</sl-label>
        <sl-radio-group id="radio-group2" name="radioGroup2" required error-size="md">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>

        <h2>Large</h2>

        <sl-label for="input3">Input</sl-label>
        <sl-input id="input3" name="input3" required error-size="lg"></sl-input>

        <sl-label for="textarea3">Textarea</sl-label>
        <sl-textarea id="textarea3" name="textarea3" required error-size="lg"></sl-textarea>

        <sl-label for="checkbox3">Checkbox</sl-label>
        <sl-checkbox id="checkbox3" name="checkbox3" required value="checkbox" error-size="lg">Checkbox</sl-checkbox>

        <sl-label for="checkbox-group3">Checkbox group</sl-label>
        <sl-checkbox-group id="checkbox-group3" name="checkboxGroup3" required error-size="lg">
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>

        <sl-label for="radio-group3">Radio group</sl-label>
        <sl-radio-group id="radio-group3" name="radioGroup3" required error-size="lg">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </form>
    `;
  }
};
