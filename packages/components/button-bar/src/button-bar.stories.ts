import '@sl-design-system/button/register.js';
import '@sl-design-system/button-group/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ButtonBar } from './button-bar.js';

type Props = Pick<ButtonBar, 'align' | 'reverse' | 'size'> & { buttons: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Button bar',
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
    <style>
      @media (max-width: 600px) {
        sl-button-bar {
          --sl-button-bar-vertical: var(--sl-ON);
        }
      }
    </style>
    <sl-button-bar .align=${align} ?reverse=${reverse} size=${ifDefined(size)}>
      ${buttons ??
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
          <sl-icon name="smile"></sl-icon>
          Baz
        </sl-button>
      `}
    </sl-button-bar>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Alignment: Story = {
  render: () => {
    const buttons = html`
      <sl-button><sl-icon name="home-blank"></sl-icon> Foo</sl-button>
      <sl-button><sl-icon name="pinata"></sl-icon> Bar</sl-button>
      <sl-button><sl-icon name="smile"></sl-icon> Baz</sl-button>
    `;
    return html`
      <p>Start:</p>
      <sl-button-bar style="--sl-button-bar-align: start;"> ${buttons} </sl-button-bar>
      <p>End:</p>
      <sl-button-bar style="--sl-button-bar-align: end;"> ${buttons} </sl-button-bar>
      <p>Center:</p>
      <sl-button-bar style="--sl-button-bar-align: center;"> ${buttons} </sl-button-bar>
      <p>Space between:</p>
      <sl-button-bar style="--sl-button-bar-align: space-between;"> ${buttons} </sl-button-bar>
    `;
  }
};

export const Groups: Story = {
  args: {
    buttons: html`
      <sl-button-group>
        <sl-button>Foo</sl-button>
        <sl-button>Bar</sl-button>
      </sl-button-group>
      <sl-button-group>
        <sl-button>Baz</sl-button>
        <sl-button>Qux</sl-button>
      </sl-button-group>
    `
  }
};

export const Mobile: Story = {
  ...Basic,
  parameters: {
    viewport: {
      defaultViewport: 'iphone13'
    }
  }
};

export const Wrapping: Story = {
  args: {
    buttons: html`
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
    buttons: html`
      <sl-button fill="ghost">
        <sl-icon name="home-blank"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="smile"></sl-icon>
      </sl-button>
    `
  }
};
