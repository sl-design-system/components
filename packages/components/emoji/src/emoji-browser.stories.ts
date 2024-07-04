import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type EmojiBrowser } from './emoji-browser.js';

type Props = Pick<EmojiBrowser, 'frequentlyUsed' | 'locale' | 'query'>;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Emoji browser',
  tags: ['draft'],
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    locale: 'en'
  },
  argTypes: {
    frequentlyUsed: {
      type: 'string'
    },
    query: {
      type: 'string'
    }
  },
  render: ({ frequentlyUsed, locale, query }) => {
    return html`
      <sl-emoji-browser
        base-url="/emoji"
        frequently-used=${ifDefined(frequentlyUsed)}
        locale=${ifDefined(locale)}
        query=${ifDefined(query)}
        style="height: 100dvh"
      ></sl-emoji-browser>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const FrequentlyUsed: Story = {
  args: {
    frequentlyUsed: '😀 😂 😎 🤔 🤷‍♂️'
  }
};

export const Search: Story = {
  args: {
    query: 'point'
  }
};
