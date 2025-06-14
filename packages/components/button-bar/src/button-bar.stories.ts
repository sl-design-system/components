import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ButtonBar } from './button-bar.js';

type Props = Pick<ButtonBar, 'align' | 'reverse' | 'size'> & { buttons(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Actions/Button bar',
  tags: ['stable'],
  args: {
    align: 'start',
    reverse: false
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between']
    },
    buttons: {
      table: { disable: true }
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  render: ({ align, buttons, reverse, size }) => html`
    <sl-button-bar .align=${align} ?reverse=${reverse} size=${ifDefined(size)}>
      ${buttons?.() ??
      html`
        <sl-button>
          <sl-icon name="home-blank"></sl-icon>
          Foo
        </sl-button>
        <sl-button>
          <sl-icon name="pinata"></sl-icon>
          Bar
        </sl-button>
        <sl-button>
          <sl-icon name="face-smile"></sl-icon>
          Baz
        </sl-button>
      `}
    </sl-button-bar>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Groups: Story = {
  args: {
    buttons: () => html`
      <sl-toggle-group>
        <sl-toggle-button>Foo</sl-toggle-button>
        <sl-toggle-button>Bar</sl-toggle-button>
      </sl-toggle-group>
      <sl-toggle-group>
        <sl-toggle-button>Baz</sl-toggle-button>
        <sl-toggle-button>Qux</sl-toggle-button>
      </sl-toggle-group>
    `
  }
};

export const Wrapping: Story = {
  args: {
    buttons: () => html`
      <sl-button>Lorem </sl-button>
      <sl-button>dolor</sl-button>
      <sl-button>sit</sl-button>
      <sl-button>amet</sl-button>
      <sl-button>officia</sl-button>
      <sl-button>esse</sl-button>
      <sl-button>sunt</sl-button>
      <sl-button>nulla</sl-button>
      <sl-button>et</sl-button>
      <sl-button>sint</sl-button>
      <sl-button>nostrud</sl-button>
      <sl-button>nisi</sl-button>
      <sl-button>ullamco</sl-button>
      <sl-button>ut</sl-button>
    `
  }
};

export const IconOnly: Story = {
  args: {
    buttons: () => html`
      <sl-button aria-label="Home" fill="ghost">
        <sl-icon name="home-blank"></sl-icon>
      </sl-button>
      <sl-button aria-label="Pinata" fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
      <sl-button aria-label="Smile" fill="ghost">
        <sl-icon name="face-smile"></sl-icon>
      </sl-button>
    `
  }
};

export const All: Story = {
  render: () => {
    const buttons = html`
      <sl-button><sl-icon name="home-blank"></sl-icon> Foo</sl-button>
      <sl-button><sl-icon name="pinata"></sl-icon> Bar</sl-button>
      <sl-button><sl-icon name="face-smile"></sl-icon> Baz</sl-button>
    `;

    return html`
      <style>
        .wrapper {
          align-items: center;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
        }
      </style>
      <div class="wrapper">
        <span>default</span>
        <sl-button-bar>${buttons}</sl-button-bar>

        <span>align center</span>
        <sl-button-bar align="center">${buttons}</sl-button-bar>

        <span>align end</span>
        <sl-button-bar align="end">${buttons}</sl-button-bar>

        <span>align space-between</span>
        <sl-button-bar align="space-between">${buttons}</sl-button-bar>

        <span>reverse</span>
        <sl-button-bar reverse>${buttons}</sl-button-bar>

        <span>icon only</span>
        <sl-button-bar>
          <sl-button aria-label="Home" fill="ghost">
            <sl-icon name="home-blank"></sl-icon>
          </sl-button>
          <sl-button aria-label="Pinata" fill="ghost">
            <sl-icon name="pinata"></sl-icon>
          </sl-button>
          <sl-button aria-label="Smile" fill="ghost">
            <sl-icon name="face-smile"></sl-icon>
          </sl-button>
        </sl-button-bar>
      </div>
    `;
  }
};
