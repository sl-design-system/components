import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import '../button-bar/register.js';
import '../input/register.js';
import './register.js';

export default {
  title: 'Label'
};

export const API: StoryObj = {
  args: {
    required: false,
    text: 'Label text'
  },
  render: ({ required, text }) => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">${text}</sl-label>
      <sl-input ?required=${required} id="input"></sl-input>
    </form>
  `
};

export const LabelSize: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
      sl-label:not(:first-child) {
        margin-top: 16px;
      }
    </style>
    <form>
      <sl-label for="input1a" size="sm" info="true">
        I am small
        <span slot="icon">test <sl-icon name="face-smile"></sl-icon></span>
      </sl-label>
      <sl-input id="input1a" required></sl-input>
      <sl-label for="input1" size="sm" info="true">I am small</sl-label>
      <sl-input id="input1"></sl-input>
      <sl-label for="input2" size="md" info="true">I am medium</sl-label>
      <sl-input id="input2"></sl-input>
      <sl-label for="input3" size="lg" info="true">I am large</sl-label>
      <sl-input id="input3" size="lg"></sl-input>
      <sl-label for="input4" size="sm">I am small disabled</sl-label>
      <sl-input id="input4" disabled value="Disabled input"></sl-input>
      <sl-label for="input5" size="md">I am medium disabled</sl-label>
      <sl-input id="input5" disabled value="Disabled input"></sl-input>
      <sl-label for="input6" size="lg">I am large disabled</sl-label>
      <sl-input id="input6" size="lg" disabled value="Invalid input"></sl-input>
      <sl-label for="input4" size="sm" invalid>I am small disabled</sl-label>
      <sl-input id="input4" value="Invalid input" invalid></sl-input>
      <sl-label for="input5" size="md" invalid>I am medium disabled</sl-label>
      <sl-input id="input5" value="Invalid input" invalid></sl-input>
      <sl-label for="input6" size="lg" invalid>I am large disabled</sl-label>
      <sl-input id="input6" size="lg" value="Disabled input" invalid></sl-input>
    </form>
  `
};

export const CustomLabel: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label"><u>Hello</u> <em>World</em></label>
      </sl-label>
      <sl-input id="input"></sl-input>
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

      sl-input {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as required</sl-label>
      <sl-input required id="input"></sl-input>

      <sl-label for="input2">Optional input</sl-label>
      <sl-input id="input2"></sl-input>

      <sl-label for="input3">Optional input</sl-label>
      <sl-input id="input3"></sl-input>

      <sl-button-bar align="end">
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const Optional: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }

      sl-input {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as optional</sl-label>
      <sl-input id="input"></sl-input>

      <sl-label for="input2">Required input</sl-label>
      <sl-input required id="input2"></sl-input>

      <sl-label for="input3">Required input</sl-label>
      <sl-input required id="input3"></sl-input>

      <sl-button-bar align="end">
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};

export const LabelWithInfoIcon: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="input1" size="sm" info="true">I am small</sl-label>
      <sl-input id="input1"></sl-input>
      <sl-label for="input2" size="md" info="true">I am medium</sl-label>
      <sl-input id="input2"></sl-input>
      <sl-label for="input3" size="lg" info="true">I am large</sl-label>
      <sl-input id="input3" size="lg"></sl-input>
    </form>
  `
};
