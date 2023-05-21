import type { Popover } from './popover.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/input/register.js';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../register.js';

type Props = Pick<Popover, 'placement'>;

type Story = StoryObj<Props>;

export default {
  title: 'Popover',
  args: {
    placement: 'top'
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  parameters: {
    layout: 'centered'
  },
  render: ({ placement }) => html`
    <sl-button popovertarget="popover">Toggle popover</sl-button>
    <sl-popover id="popover" placement=${ifDefined(placement)}>I'm a popover</sl-popover>
  `
} satisfies Meta;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => popover.showPopover());
    });

    return html`
      <span id="anchor">Popover</span>
      <sl-popover anchor="anchor" placement="top" popover="manual">Top</sl-popover>
      <sl-popover anchor="anchor" placement="right" popover="manual">Right</sl-popover>
      <sl-popover anchor="anchor" placement="bottom" popover="manual">Bottom</sl-popover>
      <sl-popover anchor="anchor" placement="left" popover="manual">Left</sl-popover>
    `;
  }
};

export const Focus: Story = {
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
        <sl-input placeholder="Input"></sl-input>
        <sl-button-bar align="end">
          <sl-button size="sm">Save</sl-button>
        </sl-button-bar>
      </form>
    </sl-popover>
  `
};
