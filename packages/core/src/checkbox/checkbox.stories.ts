import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../label/register.js';
import './register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

export default {
  title: 'Checkbox',
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    text: 'Toggle me',
    value: '12345',
    size: 'md',
    hint: 'Something to help the user out'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  }
};

export const API: StoryObj = {
  render: ({ checked, disabled, indeterminate, text, value, size, hint }) => html`
    <sl-checkbox
      ?checked=${checked}
      ?disabled=${disabled}
      .indeterminate=${indeterminate}
      .value=${value}
      .size=${size}
      .hint=${hint}
      >${text}</sl-checkbox
    >
  `
};

export const All: StoryObj = {
  render: () => html`
    <style>
      .grid {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
      }
      h2 {
        font-family: var(--sl-text-typeset-font-family-heading);
      }
    </style>
    <h2>Medium</h2>
    <div class="grid">
      <sl-checkbox>Default</sl-checkbox>
      <sl-checkbox checked>Checked</sl-checkbox>
      <sl-checkbox indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox disabled>Default</sl-checkbox>
      <sl-checkbox disabled checked>Checked</sl-checkbox>
      <sl-checkbox disabled indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox invalid>Default</sl-checkbox>
      <sl-checkbox invalid checked>Checked</sl-checkbox>
      <sl-checkbox invalid indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox invalid disabled>Default</sl-checkbox>
      <sl-checkbox invalid disabled checked>Checked</sl-checkbox>
      <sl-checkbox invalid disabled indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox valid>Default</sl-checkbox>
      <sl-checkbox valid checked>Checked</sl-checkbox>
      <sl-checkbox valid indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox valid disabled>Default</sl-checkbox>
      <sl-checkbox valid disabled checked>Checked</sl-checkbox>
      <sl-checkbox valid disabled indeterminate>Indeterminate</sl-checkbox>
    </div>
    <h2>Large</h2>
    <div class="grid">
      <sl-checkbox size="lg">Default</sl-checkbox>
      <sl-checkbox size="lg" checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox size="lg" disabled>Default</sl-checkbox>
      <sl-checkbox size="lg" disabled checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" disabled indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox size="lg" invalid>Default</sl-checkbox>
      <sl-checkbox size="lg" invalid checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" invalid indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox size="lg" invalid disabled>Default</sl-checkbox>
      <sl-checkbox size="lg" invalid disabled checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" invalid disabled indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox size="lg" valid>Default</sl-checkbox>
      <sl-checkbox size="lg" valid checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" valid indeterminate>Indeterminate</sl-checkbox>

      <sl-checkbox size="lg" valid disabled>Default</sl-checkbox>
      <sl-checkbox size="lg" valid disabled checked>Checked</sl-checkbox>
      <sl-checkbox size="lg" valid disabled indeterminate>Indeterminate</sl-checkbox>
    </div>
  `
};

export const Indeterminate: StoryObj = {
  render: () => html`<sl-checkbox indeterminate>Indeterminate</sl-checkbox>`
};

export const NoText: StoryObj = {
  render: () => html`<sl-checkbox aria-label="Hello world"></sl-checkbox>`
};

export const Overflow: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .wrapper {
        border: 2px solid rgb(var(--sl-color-palette-accent-base));
      }
    </style>
    <em>Borders are added to show the alignment in the container</em>
    <div class="wrapper">
      <sl-checkbox
        >Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea proident nulla
        consectetur anim incididunt esse magna eu. In est cupidatat ea veniam exercitation irure ullamco nisi proident
        enim.
      </sl-checkbox>
    </div>
    <div class="wrapper">
      <sl-checkbox>Elit consectetur. </sl-checkbox>
    </div>
  `
};

export const WithLabel: StoryObj = {
  render: () => html`
    <label for="checkbox">Label</label>
    <sl-checkbox id="checkbox">Checkbox</sl-checkbox>
  `
};

export const Group: StoryObj = {
  render: () => html`
    <sl-label for="group">Checkbox group</sl-label>
    <sl-checkbox-group id="group" hint="Pick one of these options.">
      <sl-checkbox>Check me</sl-checkbox>
      <sl-checkbox>No me</sl-checkbox>
      <sl-checkbox>I was here first!</sl-checkbox>
      <sl-checkbox disabled>Can't check me, even if you wanted to</sl-checkbox>
    </sl-checkbox-group>
  `
};

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
        <sl-label for="group">Checkbox group</sl-label>
        <sl-checkbox-group id="group" required id="options" name="options">
          <sl-checkbox value="1">Check me</sl-checkbox>
          <sl-checkbox value="2" checked>No me</sl-checkbox>
          <sl-checkbox value="3">I was here first!</sl-checkbox>
          <sl-checkbox value="4" disabled>Can't check me, even if you wanted to</sl-checkbox>
        </sl-checkbox-group>
        <sl-label for="conditions">Read everything?</sl-label>
        <sl-checkbox value="read" name="conditions" required checked
          >Yes, I have read the terms and conditions</sl-checkbox
        >
        <sl-label for="newletter">Can we spam you?</sl-label>
        <sl-checkbox value="yes" name="newletter">Yes, subscribe me to the newsletter</sl-checkbox>
        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit">Submit</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};
