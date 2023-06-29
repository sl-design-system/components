import type { Popover } from './popover.js';
import type { Button } from '@sl-design-system/button';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/text-input/register.js';
import { anchor } from '@sl-design-system/shared';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../register.js';

type Props = Pick<Popover, 'position'>;

type Story = StoryObj<Props>;

export default {
  title: 'Popover',
  args: {
    position: 'top'
  },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  parameters: {
    layout: 'centered'
  },
  render: ({ position }) => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;

      popover.togglePopover();
    };

    return html`
      <sl-button @click=${onClick} id="button">Toggle popover</sl-button>
      <sl-popover anchor="button" position=${ifDefined(position)}>I'm a popover</sl-popover>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => popover.showPopover());
    });

    return html`
      <style>
        sl-popover {
          --sl-popover-offset: 32px;
        }
      </style>
      <span id="anchor">Popover</span>
      <sl-popover anchor="anchor" popover="manual" position="top">Top</sl-popover>
      <sl-popover anchor="anchor" popover="manual" position="right">Right</sl-popover>
      <sl-popover anchor="anchor" popover="manual" position="bottom">Bottom</sl-popover>
      <sl-popover anchor="anchor" popover="manual" position="left">Left</sl-popover>
    `;
  }
};

export const Directive: Story = {
  render: () => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;

      popover.togglePopover();
    };

    return html`
      <sl-button @click=${onClick} id="button">Toggle popover</sl-button>
      <dialog anchor="button" popover ${anchor()}>I'm a popover</dialog>
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
        <sl-text-input placeholder="Input"></sl-text-input>
        <sl-button-bar align="end">
          <sl-button size="sm">Save</sl-button>
        </sl-button-bar>
      </form>
    </sl-popover>
  `
};
