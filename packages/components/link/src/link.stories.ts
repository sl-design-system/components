import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Link } from './link.js';

interface Props extends Pick<Link, 'fill' | 'type' | 'iconPosition'> {
  href: string;
  label: string;
  rel?: string;
  target?: string;
}

type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Link',
  args: {
    fill: 'solid',
    href: '/dashboard',
    label: 'Open dashboard'
  },
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost']
    },
    type: {
      control: 'inline-radio',
      options: ['internal', 'internal-new-tab', 'external']
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['start', 'end']
    }
  },
  render: ({ fill, href, iconPosition, label, rel, target, type }) => html`
    <sl-link
      fill=${ifDefined(fill)}
      type=${ifDefined(type)}
      icon-position=${ifDefined(iconPosition)}>
      <a href=${href} rel=${ifDefined(rel)} target=${ifDefined(target)}>${label}</a>
    </sl-link>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const InternalNewTab: Story = {
  args: {
    href: '/dashboard',
    label: 'Open dashboard in a new tab',
    target: '_blank'
  }
};

export const External: Story = {
  args: {
    href: 'https://sanomalearning.com',
    label: 'Open external website'
  }
};

export const ClickEvent: Story = {
  args: {
    href: '/dashboard',
    label: 'Open dashboard'
  },
  render: ({ fill, href, iconPosition, label, rel, target, type }) => html`
    <sl-link
      fill=${ifDefined(fill)}
      type=${ifDefined(type)}
      icon-position=${ifDefined(iconPosition)}
      @click=${() => {
        console.log('Link clicked!');
      }}>
      <a href=${href} rel=${ifDefined(rel)} target=${ifDefined(target)}>${label}</a>
    </sl-link>
  `
};
export const ForcedExternalType: Story = {
  args: {
    href: '/internal-route',
    label: 'Force external behavior',
    type: 'external'
  }
};

export const All: Story = {
  render: () => html`
    <style>
      div:where(.fill-variants, .color-variants) {
        display: grid;
        gap: 1rem;
        justify-items: start;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        margin-bottom: 2rem;
      }
      div:where(.fill-variants, .color-variants) > div {
        display: grid;
        gap: 1rem;
        justify-items: start;
      }
    </style>
    <div class="fill-variants">
      <div>
        <sl-link fill="outline">
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link fill="outline" icon-position="start">
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link fill="outline">
          <a href="/reports" target="_blank">Internal link button (new tab)</a>
        </sl-link>

        <sl-link fill="outline">
          <a href="https://sanomalearning.com">External link button</a>
        </sl-link>
      </div>
      <div>
        <sl-link>
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link icon-position="start">
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link>
          <a href="/reports" target="_blank">Internal link button (new tab)</a>
        </sl-link>

        <sl-link>
          <a href="https://sanomalearning.com">External link button</a>
        </sl-link>
      </div>
      <div>
        <sl-link fill="ghost">
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link fill="ghost" icon-position="start">
          <a href="/dashboard">Internal link button</a>
        </sl-link>

        <sl-link fill="ghost">
          <a href="/reports" target="_blank">Internal link button (new tab)</a>
        </sl-link>

        <sl-link fill="ghost">
          <a href="https://sanomalearning.com">External link button</a>
        </sl-link>
      </div>
    </div>
    <div class="color-variants">
      <div>${colorVariants('outline')}</div>
      <div>${colorVariants('solid')}</div>
      <div>${colorVariants('ghost')}</div>
    </div>

    <div
      class="inverted color-variants"
      style="background-color: var(--sl-color-background-primary-bold); padding: 1rem;">
      <div>
        <sl-link fill="outline" variant="inverted">
          <a href="/start">Inverted</a>
        </sl-link>
      </div>
      <div>
        <sl-link fill="solid" variant="inverted">
          <a href="/start">Inverted</a>
        </sl-link>
      </div>
      <div>
        <sl-link fill="ghost" variant="inverted">
          <a href="/start">Inverted</a>
        </sl-link>
      </div>
    </div>
  `
};

function colorVariants(fill: 'solid' | 'outline' | 'ghost') {
  return html`
    <sl-link fill=${fill} variant="primary">
      <a href="/start">Primary</a>
    </sl-link>

    <sl-link fill=${fill} variant="secondary">
      <a href="/start">Secondary</a>
    </sl-link>

    <sl-link fill=${fill} variant="success">
      <a href="/start">Success</a>
    </sl-link>
    <sl-link fill=${fill} variant="info">
      <a href="/start">Info</a>
    </sl-link>

    <sl-link fill=${fill} variant="warning">
      <a href="/start">Warning</a>
    </sl-link>

    <sl-link fill=${fill} variant="danger">
      <a href="/start">Danger</a>
    </sl-link>
  `;
}
