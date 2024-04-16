import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ButtonBar } from './button-bar.js';

type Props = Pick<ButtonBar, 'align' | 'reverse'> & { buttons: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'In progress/Button bar',
  args: {
    align: 'start',
    reverse: false
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between']
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'default'
    }
  },
  render: ({ align, buttons, reverse }) => html`
    <style>
      @media (max-width: 600px) {
        sl-button-bar {
          --sl-button-bar-direction: column;
        }
      }
    </style>
    <sl-button-bar .align=${align} .reverse=${reverse}>
      ${buttons ??
      html`
        <sl-button><sl-icon name="home-blank"></sl-icon> Foo</sl-button>
        <sl-button><sl-icon name="pinata"></sl-icon> Bar</sl-button>
        <sl-button><sl-icon name="smile"></sl-icon> Baz</sl-button>
      `}
    </sl-button-bar>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Mobile: Story = {
  ...Basic,
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  }
};

export const IconOnly: Story = {
  args: {
    buttons: html`
      <sl-button fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
    `
  }
};
