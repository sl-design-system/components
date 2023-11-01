import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/tooltip/register.js';
import '@sl-design-system/switch/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Form/Label'
};

export const API: StoryObj = {
  args: {
    disabled: true,
    required: false,
    text: 'Label text'
  },
  render: ({ required, text, disabled }) => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">${text}</sl-label>
      <sl-text-input ?required=${required} id="input" ?disabled=${disabled}></sl-text-input>
    </form>
  `
};

export const Disabled: StoryObj = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }
        sl-label:not(:first-of-type) {
          margin-block-start: 1rem;
        }
      </style>
      <form>
        <sl-label for="enabled">I should be enabled</sl-label>
        <sl-text-input id="enabled"></sl-text-input>

        <sl-label for="disabled">I should be disabled</sl-label>
        <sl-text-input disabled id="disabled"></sl-text-input>
      </form>
    `;
  }
};

export const Size: StoryObj = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
        }
        sl-label:not(:first-of-type) {
          margin-block-start: 1rem;
        }
      </style>
      <form>
        <sl-label for="switch">I should be small</sl-label>
        <sl-switch id="switch" size="sm">Toggle me</sl-switch>

        <sl-label for="text-input">I should be medium</sl-label>
        <sl-text-input id="text-input"></sl-text-input>

        <sl-label for="checkbox-group">I should be large</sl-label>
        <sl-checkbox-group id="checkbox-group" size="lg">
          <sl-checkbox>Checkbox 1</sl-checkbox>
          <sl-checkbox>Checkbox 2</sl-checkbox>
          <sl-checkbox>Checkbox 3</sl-checkbox>
        </sl-checkbox-group>
      </form>
    `;
  }
};

export const Optional: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      sl-text-input {
        margin-block-end: 1rem;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as optional</sl-label>
      <sl-text-input id="input"></sl-text-input>

      <sl-label for="input2">Required input</sl-label>
      <sl-text-input required id="input2"></sl-text-input>

      <sl-label for="input3">Required input</sl-label>
      <sl-text-input required id="input3"></sl-text-input>

      <sl-button-bar align="end">
        <sl-button fill="outline" type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const Required: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      sl-text-input {
        margin-block-end: 1rem;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as required</sl-label>
      <sl-text-input required id="input"></sl-text-input>

      <sl-label for="input2">Optional input</sl-label>
      <sl-text-input id="input2"></sl-text-input>

      <sl-label for="input3">Optional input</sl-label>
      <sl-text-input id="input3"></sl-text-input>

      <sl-button-bar align="end">
        <sl-button fill="outline" type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const Custom: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      label {
        align-items: center;
        display: flex;
        gap: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label">
          <span><u>Hello</u> <em>World</em></span>
          <sl-icon slot="icon" name="info" aria-describedby="tooltip1"></sl-icon>
          <sl-tooltip id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
        </label>
      </sl-label>
      <sl-text-input id="input"></sl-text-input>
    </form>
  `
};
