import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import './register.js';

export default {
  title: 'Button bar'
};

export const API: StoryObj = {
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
};
