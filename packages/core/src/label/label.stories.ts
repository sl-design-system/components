import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
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
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="input">${text}</sl-label>
      <sl-input ?required=${required} id="input"></sl-input>
    </div>
  `
};

export const CustomLabel: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="input">
        <label slot="label"><u>Hello</u> <em>World</em></label>
      </sl-label>
      <sl-input id="input"></sl-input>
    </div>
  `
};

export const Required: StoryObj = {
  render: () => html`
    <style>
      form {
        display: grid;
        grid-template-rows: repeat(3, [label] auto 0.25rem [control] auto 0.5rem);
      }

      sl-label {
        grid-row: label 1;
      }

      sl-input {
        grid-row: control 1;
      }

      sl-label:nth-of-type(2) {
        grid-row: label 2;
      }

      sl-input:nth-of-type(2) {
        grid-row: control 2;
      }

      sl-label:nth-of-type(3) {
        grid-row: label 3;
      }

      sl-input:nth-of-type(3) {
        grid-row: control 3;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as required</sl-label>
      <sl-input required id="input"></sl-input>

      <sl-label for="input2">Optional input</sl-label>
      <sl-input id="input2"></sl-input>

      <sl-label for="input3">Optional input</sl-label>
      <sl-input id="input3"></sl-input>
    </form>
  `
};

export const Optional: StoryObj = {
  render: () => html`
    <style>
      form {
        display: grid;
        grid-template-rows: repeat(3, [label] auto 0.25rem [control] auto 0.5rem);
      }

      sl-label {
        grid-row: label 1;
      }

      sl-input {
        grid-row: control 1;
      }

      sl-label:nth-of-type(2) {
        grid-row: label 2;
      }

      sl-input:nth-of-type(2) {
        grid-row: control 2;
      }

      sl-label:nth-of-type(3) {
        grid-row: label 3;
      }

      sl-input:nth-of-type(3) {
        grid-row: control 3;
      }
    </style>
    <form>
      <sl-label for="input">This label should be marked as optional</sl-label>
      <sl-input id="input"></sl-input>

      <sl-label for="input2">Required input</sl-label>
      <sl-input required id="input2"></sl-input>

      <sl-label for="input3">Required input</sl-label>
      <sl-input required id="input3"></sl-input>
    </form>
  `
};
