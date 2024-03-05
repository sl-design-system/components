import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components';
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
    <sl-form>
      <sl-form-field>
        <sl-label for="input">${text}</sl-label>
        <sl-text-field ?required=${required} id="input" ?disabled=${disabled}></sl-text-field>
      </sl-form-field>
    </sl-form>
  `
};

export const Disabled: StoryObj = {
  render: () => {
    return html`
      <sl-form>
        <sl-form-field>
          <sl-label for="enabled">I should be enabled</sl-label>
          <sl-text-field id="enabled"></sl-text-field>
        </sl-form-field>

        <sl-form-field>
          <sl-label for="disabled">I should be disabled</sl-label>
          <sl-text-field disabled id="disabled"></sl-text-field>
        </sl-form-field>
      </sl-form>
    `;
  }
};

export const Size: StoryObj = {
  render: () => {
    return html`
      <sl-form>
        <sl-form-field>
          <sl-label for="switch">I should be small</sl-label>
          <sl-switch id="switch" size="sm">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field>
          <sl-label for="text-input">I should be medium</sl-label>
          <sl-text-field id="text-input"></sl-text-field>
        </sl-form-field>

        <sl-form-field>
          <sl-label for="checkbox-group">I should be large</sl-label>
          <sl-checkbox-group id="checkbox-group" size="lg">
            <sl-checkbox>Checkbox 1</sl-checkbox>
            <sl-checkbox>Checkbox 2</sl-checkbox>
            <sl-checkbox>Checkbox 3</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>
      </sl-form>
    `;
  }
};

export const Optional: StoryObj = {
  render: () => html`
    <sl-form>
      <sl-form-field label="This label should be marked as optional">
        <sl-text-field></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Required input">
        <sl-text-field required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Required input">
        <sl-text-field required></sl-text-field>
      </sl-form-field>

      <sl-button-bar align="end">
        <sl-button fill="outline" type="submit">Submit</sl-button>
      </sl-button-bar>
    </sl-form>
  `
};

export const Required: StoryObj = {
  render: () => html`
    <sl-form>
      <sl-form-field label="This label should be marked as required">
        <sl-text-field required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Required input">
        <sl-text-field></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Required input">
        <sl-text-field></sl-text-field>
      </sl-form-field>

      <sl-button-bar align="end">
        <sl-button fill="outline" type="submit">Submit</sl-button>
      </sl-button-bar>
    </sl-form>
  `
};

export const Custom: StoryObj = {
  render: () => html`
    <style>
      label {
        align-items: center;
        display: flex;
        gap: 0.5rem;
      }
    </style>
    <sl-form>
      <sl-form-field>
        <sl-label for="input">
          <label slot="label">
            <span><u>Hello</u> <em>World</em></span>
            <sl-icon slot="icon" name="info" aria-describedby="tooltip1"></sl-icon>
            <sl-tooltip id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
          </label>
        </sl-label>
        <sl-text-field id="input"></sl-text-field>
      </sl-form-field>
    </sl-form>
  `
};
