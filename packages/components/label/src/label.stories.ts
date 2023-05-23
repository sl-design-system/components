import type { LabelSize } from './label.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/input/register.js';
import '@sl-design-system/tooltip/register.js';
import type { IconSize } from '@sl-design-system/icon';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Label'
};

const sizes: LabelSize[] = ['sm', 'md', 'lg'];
const iconSizes: IconSize[] = ['xs', 'sm', 'md'];

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
      <sl-text-input ?required=${required} id="input"></sl-text-input>
    </form>
  `
};

export const LabelSizes: StoryObj = {
  render: () => {
    setTimeout(() => {
      const form = document.querySelector('form');
      const slLabels = form?.querySelectorAll('sl-label');

      slLabels?.forEach((label, idx) => {
        const id = `form-${idx}`;
        label.setAttribute('for', id);
        (label.nextElementSibling as HTMLElement).setAttribute('id', id);
      });
    });

    return html`
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
        ${sizes.map(
          (size, id) => html`
            <h2>Size: ${size}</h2>
            <sl-label size=${size} info="true">
              I am ${size} label
              <sl-icon slot="icon" name="info" aria-describedby="tooltip1" size=${iconSizes[id]}></sl-icon>
              <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
            </sl-label>
            <sl-text-input required></sl-text-input>
            <sl-label size=${size} info="true">
              ${size} disabled label
              <sl-icon slot="icon" name="info" aria-describedby="tooltip1" size=${iconSizes[id]}></sl-icon>
              <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
            </sl-label>
            <sl-text-input disabled></sl-text-input>
            <sl-label size=${size} info="true">
              I am ${size} invalid label
              <sl-icon slot="icon" name="info" aria-describedby="tooltip1" size=${iconSizes[id]}></sl-icon>
              <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
            </sl-label>
            <sl-text-input invalid required></sl-text-input>
            <sl-label for="input3a" size=${size} info="true" no-padding>
              I am ${size} label with no padding
              <sl-icon slot="icon" name="info" aria-describedby="tooltip3a" size=${iconSizes[id]}></sl-icon>
              <sl-tooltip slot="tooltip" id="tooltip3a">I am a tooltip for the info icon</sl-tooltip>
            </sl-label>
            <sl-text-input id="input3a" size="lg"></sl-text-input>
          `
        )}
      </form>
    `;
  }
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
      <sl-text-input id="input"></sl-text-input>
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
        margin-block-end: 0.5rem;
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

      sl-text-input {
        margin-block-end: 0.5rem;
      }

      sl-button-bar {
        margin-top: 0.5rem;
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
      sl-text-input {
        margin-block-end: 0.5rem;
      }
    </style>
    <form>
      <sl-label for="input1" size="sm" info="true">
        Label small
        <sl-icon slot="icon" name="info" size="xs" aria-describedby="tooltip"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-text-input id="input1"></sl-text-input>
      <sl-label for="input2" size="md" info="true">
        Label medium
        <sl-icon slot="icon" name="info" size="sm" aria-describedby="tooltip1"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip1">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-text-input id="input2"></sl-text-input>
      <sl-label for="input3" size="lg" info="true">
        Label large
        <sl-icon slot="icon" name="info" size="md" aria-describedby="tooltip2"></sl-icon>
        <sl-tooltip slot="tooltip" id="tooltip2">I am a tooltip for the info icon</sl-tooltip>
      </sl-label>
      <sl-text-input id="input3" size="lg"></sl-text-input>
    </form>
  `
};
