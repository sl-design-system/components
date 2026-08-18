import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Link } from './link.js';

interface Props extends Pick<
  Link,
  'fill' | 'iconPosition' | 'shape' | 'size' | 'type' | 'variant' | 'noIcon'
> {
  href: string;
  linkText: string;
  rel?: string;
  target?: string;
  description?: string;
}

type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Link',
  args: {
    href: '/dashboard',
    linkText: 'Open dashboard'
  },
  argTypes: {
    description: {
      table: { disable: true }
    },
    fill: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost']
    },
    type: {
      control: 'inline-radio',
      options: ['internal', 'internal-new-tab', 'external', 'email', 'tel']
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['start', 'end']
    },
    noIcon: {
      control: 'boolean'
    },
    shape: {
      control: 'inline-radio',
      options: ['rect', 'pill']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'inverted']
    },
    target: {
      control: 'inline-radio',
      options: [undefined, '_self', '_blank', '_parent', '_top']
    }
  },
  render: ({
    description,
    fill,
    href,
    iconPosition,
    linkText,
    rel,
    shape,
    size,
    target,
    type,
    variant,
    noIcon
  }) => html`
    ${description ? html`<p>${description}</p>` : nothing}
    <sl-link
      fill=${ifDefined(fill)}
      type=${ifDefined(type)}
      icon-position=${ifDefined(iconPosition)}
      shape=${ifDefined(shape)}
      size=${ifDefined(size)}
      variant=${ifDefined(variant)}
      ?no-icon=${noIcon ?? nothing}>
      <a href=${href} rel=${ifDefined(rel)} target=${ifDefined(target)}>${linkText}</a>
    </sl-link>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const linkTypes: Story = {
  argTypes: {
    ...Basic.argTypes,
    type: { table: { disable: true } },
    linkText: { table: { disable: true } },
    href: { table: { disable: true } }
  },
  render: ({ fill, iconPosition, noIcon, variant, shape, size }) => html`
    <div style="display: grid; gap: 1rem; justify-items: start;">
      <sl-link
        fill=${ifDefined(fill)}
        icon-position=${ifDefined(iconPosition)}
        shape=${ifDefined(shape)}
        variant=${ifDefined(variant)}
        size=${ifDefined(size)}
        ?no-icon=${noIcon ?? nothing}>
        <a href="/dashboard">Internal link</a>
      </sl-link>

      <sl-link
        fill=${ifDefined(fill)}
        icon-position=${ifDefined(iconPosition)}
        shape=${ifDefined(shape)}
        variant=${ifDefined(variant)}
        size=${ifDefined(size)}
        ?no-icon=${noIcon ?? nothing}>
        <a href="/reports" target="_blank">Internal link</a>
      </sl-link>

      <sl-link
        fill=${ifDefined(fill)}
        icon-position=${ifDefined(iconPosition)}
        shape=${ifDefined(shape)}
        variant=${ifDefined(variant)}
        size=${ifDefined(size)}
        ?no-icon=${noIcon ?? nothing}>
        <a href="https://sanomalearning.design" target="_blank">External link</a>
      </sl-link>

      <sl-link
        fill=${ifDefined(fill)}
        icon-position=${ifDefined(iconPosition)}
        shape=${ifDefined(shape)}
        variant=${ifDefined(variant)}
        size=${ifDefined(size)}
        ?no-icon=${noIcon ?? nothing}>
        <a href="mailto:team@sanomalearning.design" target="_blank">Email link</a>
      </sl-link>

      <sl-link
        fill=${ifDefined(fill)}
        icon-position=${ifDefined(iconPosition)}
        shape=${ifDefined(shape)}
        variant=${ifDefined(variant)}
        size=${ifDefined(size)}
        ?no-icon=${noIcon ?? nothing}>
        <a href="tel:+123456789012" target="_blank">Telephone link</a>
      </sl-link>
    </div>
  `
};
export const ClickEvent: Story = {
  args: {
    href: '/dashboard',
    linkText: 'Open dashboard'
  },
  render: ({ fill, href, iconPosition, linkText, rel, target, type }) => html`
    <sl-link
      fill=${ifDefined(fill)}
      type=${ifDefined(type)}
      icon-position=${ifDefined(iconPosition)}
      @click=${() => {
        console.log('Link clicked!');
      }}>
      <a href=${href} rel=${ifDefined(rel)} target=${ifDefined(target)}>${linkText}</a>
    </sl-link>
  `
};
export const OverwriteLinkType: Story = {
  args: {
    href: '/internal-route',
    linkText: 'Force external behavior',
    type: 'external',
    description:
      'You can overwrite the inferred link type by setting the `type` attribute. This is useful for external links that should be treated as internal links, or vice versa.'
  }
};

export const All: Story = {
  render: () => html`
    <style>
      div:where(.fill-variants, .color-variants, .size-variants) {
        display: grid;
        gap: 1rem;
        justify-items: start;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        margin-bottom: 2rem;
        align-items: start;
      }
      div:where(.fill-variants, .color-variants) > div {
        display: grid;
        gap: 1rem;
        justify-items: start;
      }
    </style>
    <div class="fill-variants">
      <sl-link no-icon>
        <a href="/dashboard">Internal link without icon</a>
      </sl-link>

      <sl-link>
        <a href="/dashboard">Internal link</a>
      </sl-link>

      <sl-link icon-position="start">
        <a href="/dashboard">Internal link</a>
      </sl-link>

      <sl-link>
        <a href="/reports" target="_blank">Internal link in new tab</a>
      </sl-link>

      <sl-link>
        <a href="https://sanomalearning.com">External link</a>
      </sl-link>

      <sl-link shape="pill">
        <a href="/dashboard">Internal link</a>
      </sl-link>

      <sl-link>
        <a href="mailto:team@sanomalearning.design">Email link</a>
      </sl-link>

      <sl-link>
        <a href="tel:+123456789012">Telephone link</a>
      </sl-link>
    </div>

    <div class="size-variants">
      <sl-link size="sm">
        <a href="/dashboard">Small link</a>
      </sl-link>

      <sl-link>
        <a href="/dashboard">Medium link</a>
      </sl-link>

      <sl-link size="lg">
        <a href="/dashboard">Large link</a>
      </sl-link>
    </div>

    <div class="color-variants">
      <div>${colorVariants('solid')}</div>
      <div>${colorVariants('outline')}</div>
      <div>${colorVariants('ghost')}</div>
    </div>

    <div
      class="inverted color-variants"
      style="background-color: var(--sl-color-background-primary-bold); padding: 1rem;">
      <div>
        <sl-link fill="solid" variant="inverted">
          <a href="/start">Inverted</a>
        </sl-link>
      </div>
      <div>
        <sl-link fill="outline" variant="inverted">
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
