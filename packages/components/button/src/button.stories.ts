import { faPlus, faUniversalAccess } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Button } from './button.js';

interface Props extends Pick<Button, 'disabled' | 'fill' | 'shape' | 'size' | 'variant'> {
  icon: string;
  text: string;
}
type Story = StoryObj<Props>;

Icon.register(faPlus, faUniversalAccess);

export default {
  title: 'Actions/Button',
  tags: ['stable'],
  args: {
    disabled: false,
    icon: 'none',
    text: 'Button'
  },
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'link', 'ghost']
    },
    icon: {
      control: 'inline-radio',
      options: ['start', 'end', 'none']
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'pill']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'inverted']
    }
  },
  render: ({ disabled, fill, icon, shape, size, text, variant }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="face-smile"></sl-icon>` : '';

    return html`
      <sl-button
        ?disabled=${disabled}
        fill=${ifDefined(fill)}
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}
        variant=${ifDefined(variant)}
      >
        ${startIcon}${text}${endIcon}
      </sl-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Pill: Story = {
  args: {
    shape: 'pill'
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .sizes {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 1rem 2rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr;
          justify-items: center;
          margin-block-end: 2rem;
          position: relative;
        }
        .variants {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 1rem 2rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          justify-items: center;
          position: relative;

          > span:nth-of-type(8) {
            color: var(--sl-color-text-inverted);
          }
        }
        .inverted-background {
          background: var(--sl-color-palette-grey-900);
          grid-column: 8 / 9;
          grid-row: 1 / 6;
          inset: -1rem;
          position: absolute;
          z-index: -1;
        }
      </style>
      <section class="sizes">
        <span></span>
        <span>Square text</span>
        <span>Square icon</span>
        <span>Pill text</span>
        <span>Pill icon</span>

        <span>Small</span>
        <sl-button fill="outline" size="sm">Button</sl-button>
        <sl-button fill="outline" size="sm">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="sm">Button</sl-button>
        <sl-button fill="outline" shape="pill" size="sm">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>

        <span>Medium</span>
        <sl-button fill="outline">Button</sl-button>
        <sl-button fill="outline">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill">Button</sl-button>
        <sl-button fill="outline" shape="pill">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>

        <span>Large</span>
        <sl-button fill="outline" size="lg">Button</sl-button>
        <sl-button fill="outline" size="lg">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="lg">Button</sl-button>
        <sl-button fill="outline" shape="pill" size="lg">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
      </section>
      <section class="variants">
        <span></span>
        <span>Primary</span>
        <span>Secondary</span>
        <span>Success</span>
        <span>Warning</span>
        <span>Danger</span>
        <span>Info</span>
        <span>Inverted</span>
        <span>Disabled</span>

        <span>Outline</span>
        <sl-button fill="outline" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="outline">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Solid</span>
        <sl-button variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Ghost</span>
        <sl-button fill="ghost" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="ghost">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Link</span>
        <sl-button fill="link" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="link">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <div class="inverted-background"></div>
      </section>
    `;
  }
};
