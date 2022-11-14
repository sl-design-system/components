import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../button/register.js';
import '../button-bar/register.js';
import '../input/register.js';
import './register.js';

export default {
  title: 'Popover',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  }
};

export const API: StoryObj = {
  args: {
    placement: 'top'
  },
  render: ({ placement }) => html`
    <sl-button id="button">Toggle popover</sl-button>
    <sl-popover anchor="button" placement=${ifDefined(placement)}>I'm a popover</sl-popover>
  `
};

export const Autofocus: StoryObj = {
  render: () => html`
    <style>
      sl-popover form {
        align-items: center;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr 1fr;
      }
      sl-button-bar {
        grid-column: 1 / -1;
      }
    </style>
    <sl-button id="button">Toggle popover</sl-button>
    <sl-popover anchor="button">
      <form>
        <label>Label</label>
        <sl-input autofocus placeholder="Input"></sl-input>
        <sl-button-bar align="end">
          <sl-button size="sm">Save</sl-button>
        </sl-button-bar>
      </form>
    </sl-popover>
  `
};
