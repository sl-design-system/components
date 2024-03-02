import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ButtonBarAlign } from './button-bar.js';

interface Props {
  align: ButtonBarAlign;
  reverse: boolean;
}

type Story = StoryObj<Props>;

export default {
  title: 'Button bar',
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
  render: ({ align, reverse }) => html`
    <sl-button-bar .align=${align} .reverse=${reverse}>
      <sl-button>Foo</sl-button>
      <sl-button>Bar</sl-button>
      <sl-button>Baz</sl-button>
    </sl-button-bar>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
