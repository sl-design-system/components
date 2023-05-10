import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/input/register.js';
import '@sl-design-system/tooltip/register.js';
import { html } from 'lit';
import '../register.js';

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
      <sl-label for="input1" size="sm" info="true">
        I am small
        <sl-icon slot="icon" name="info" aria-describedby="tooltip1" size="xs"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input1" required></sl-input>
      <sl-label for="input2" size="md" info="true">
        I am medium
        <sl-icon slot="icon" name="info" aria-describedby="tooltip2" size="sm"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip2">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input2" required></sl-input>
      <sl-label for="input3" size="lg" info="true">
        I am large
        <sl-icon slot="icon" name="info" aria-describedby="tooltip3" size="md"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip3">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input3" size="lg" required></sl-input>
      <sl-label for="input4" size="sm">
        I am small disabled
        <sl-icon slot="icon" name="info" aria-describedby="tooltip4" size="xs"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip4">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input4" disabled value="Disabled input" required></sl-input>
      <sl-label for="input5" size="md">
        I am medium disabled
        <sl-icon slot="icon" name="info" aria-describedby="tooltip5" size="sm"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip5">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input5" disabled value="Disabled input"></sl-input>
      <sl-label for="input6" size="lg">
        I am large disabled
        <sl-icon slot="icon" name="info" aria-describedby="tooltip6" size="md"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip6">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input6" size="lg" disabled value="Invalid input"></sl-input>
      <sl-label for="input7" size="sm" invalid>
        I am small invalid
        <sl-icon slot="icon" name="info" aria-describedby="tooltip7" size="xs"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip7">I am a tooltip for the info icon</sl-tooltip></sl-label
      >
      <sl-input id="input7" value="Invalid input" invalid></sl-input>
      <sl-label for="input8" size="md" invalid>
        I am medium invalid
        <sl-icon slot="icon" name="info" aria-describedby="tooltip8" size="sm"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip8">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input8" value="Invalid input" invalid></sl-input>
      <sl-label for="input9" size="lg" invalid>
        I am large invalid
        <sl-icon slot="icon" name="info" aria-describedby="tooltip9" size="md"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip9">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input9" size="lg" value="Disabled input" invalid></sl-input>
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
      sl-icon {
        margin-left: 8px;
      }
    </style>
    <form>
      <sl-label for="input">
        <label slot="label"
          ><u>Hello</u> <em>World</em><sl-icon slot="icon" name="info" aria-describedby="tooltip1"></sl-icon>
          <sl-tooltip id="tooltip1">I am a tooltip for the info icon</sl-tooltip></label
        >
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

      sl-button-bar {
        margin-top: 0.5rem;
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
      sl-input {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="input1" size="sm" info="true">
        Label small
        <sl-icon slot="icon" name="info" size="xs" aria-describedby="tooltip"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input1"></sl-input>
      <sl-label for="input2" size="md" info="true">
        Label medium
        <sl-icon slot="icon" name="info" size="sm" aria-describedby="tooltip1"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input2"></sl-input>
      <sl-label for="input3" size="lg" info="true">
        Label large
        <sl-icon slot="icon" name="info" size="md" aria-describedby="tooltip2"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip2">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-input id="input3" size="lg"></sl-input>
    </form>
  `
};
