import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/textarea/register.js';
import { MessageSize } from "@sl-design-system/shared";
import { html } from 'lit';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

const sizes: MessageSize[] = ['sm', 'md', 'lg'];

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
      sl-text-input,
      sl-textarea {
        align-self: stretch;
      }
    </style>
    <form>
      <sl-label for="input">Input</sl-label>
      <sl-text-input id="input" name="input" placeholder="Placeholder"></sl-text-input>

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
      sl-text-input,
      sl-textarea {
        align-self: stretch;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="input">Input</sl-label>
      <sl-text-input id="input" hint="Hint for the text input." name="input" required></sl-text-input>

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
        sl-text-input,
        sl-textarea {
          align-self: stretch;
        }
      </style>
      <form>
        <sl-label for="input">Input</sl-label>
        <sl-text-input id="input" name="input" required></sl-text-input>

        <sl-label for="textarea">Textarea</sl-label>
        <sl-textarea id="textarea" name="textarea" required></sl-textarea>

        <sl-label for="inputEmail">Email</sl-label>
        <sl-text-input id="inputEmail" type="email" required></sl-text-input>

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
        sl-text-input,
        sl-textarea {
          align-self: stretch;
        }
      </style>
      <form>
        <sl-label for="input">Input</sl-label>
        <sl-text-input id="input" name="input" required></sl-text-input>

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
      sl-text-input,
      sl-textarea {
        align-self: stretch;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="input">Label for the input</sl-label>
      <sl-text-input id="input" minlength="8" name="input" placeholder="Type at least 8 characters here" required></sl-text-input>

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
  render: ({ size }) => {
    setTimeout(() => {
      const form = document.querySelector('form');
      const slLabels = form?.querySelectorAll('sl-label') as Label[];

      slLabels?.forEach((label, idx) => {
        const id = `form-${idx}`;
        label.setAttribute('for', id);
        (label.nextElementSibling as HTMLElement).setAttribute('id', id);
      });

      form?.reportValidity()
    });

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
        sl-text-input,
        sl-textarea {
          align-self: stretch;
        }
      </style>
      <form>
        ${sizes.map(
      (size) => html`
            <h2>Size: ${size}</h2>

            <sl-label>Input</sl-label>
            <sl-text-input name="input" required error-size=${size}></sl-text-input>

            <sl-label>Textarea</sl-label>
            <sl-textarea name="textarea" required error-size=${size}></sl-textarea>

            <sl-label>Checkbox</sl-label>
            <sl-checkbox name="checkbox" required value="checkbox" error-size=${size}>Checkbox</sl-checkbox>

            <sl-label>Checkbox group</sl-label>
            <sl-checkbox-group name="checkboxGroup" required error-size=${size}>
              <sl-checkbox value="0">Check me</sl-checkbox>
              <sl-checkbox value="1">No me</sl-checkbox>
              <sl-checkbox value="2">I was here first</sl-checkbox>
            </sl-checkbox-group>

            <sl-label>Radio group</sl-label>
            <sl-radio-group name="radioGroup" required error-size=${size}>
              <sl-radio value="1">One</sl-radio>
              <sl-radio value="2">Two</sl-radio>
              <sl-radio value="3">Three</sl-radio>
            </sl-radio-group>
        `
    )}
      </form>
    `;
  }
};
