import { faPlus, faUniversalAccess } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/avatar/register.js';
import { Student, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
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
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: 'sl-button:not([disabled])'
          }
        ]
      }
    }
  },
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

export const Avatar: Story = {
  loaders: [async () => ({ students: (await getStudents({ count: 1 })).students })],
  render: (_, { loaded: { students } }) => {
    const { fullName, pictureUrl } = (students as Student[]).at(0)!;

    return html`
      <p>This example shows a <code>size="sm"</code> avatar inside a default size <code>fill="link"</code> button.</p>
      <sl-button fill="link" variant="primary">
        <sl-avatar .displayName=${fullName} .pictureUrl=${pictureUrl} size="sm"></sl-avatar>
      </sl-button>
    `;
  }
};

export const Disabled: Story = {
  render: ({ fill, shape, size, variant }) => {
    return html`
      <p>
        This example shows 2 disabled buttons. One via the <code>disabled</code> property. You can no longer interact
        with that button. You cannot focus it. It cannot receive pointer events. The second button is disabled using the
        <code>aria-disabled</code> attribute. This button is also visually disabled, but you can still focus it and it
        will receive pointer events. This second button can used in combination with a tooltip to explain why the button
        is disabled.
      </p>
      <div style="display: inline-flex; gap: 1rem">
        <sl-button
          disabled
          fill=${ifDefined(fill)}
          shape=${ifDefined(shape)}
          size=${ifDefined(size)}
          variant=${ifDefined(variant)}
        >
          Disabled button
        </sl-button>
        <sl-button
          aria-disabled="true"
          fill=${ifDefined(fill)}
          shape=${ifDefined(shape)}
          size=${ifDefined(size)}
          variant=${ifDefined(variant)}
        >
          Disabled (ARIA only) button
        </sl-button>
      </div>
    `;
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
        html {
          display: flex;
        }
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
          isolation: isolate;
          justify-items: center;
          position: relative;
          z-index: 0;

          > span:nth-of-type(8) {
            color: var(--sl-color-foreground-inverted-bold);
          }
        }
        .inverted-background {
          background: var(--sl-color-background-primary-bold);
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
        <sl-button aria-label="Add" fill="outline" size="sm">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="sm">Button</sl-button>
        <sl-button aria-label="Add" fill="outline" shape="pill" size="sm">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>

        <span>Medium</span>
        <sl-button fill="outline">Button</sl-button>
        <sl-button aria-label="Add" fill="outline">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill">Button</sl-button>
        <sl-button aria-label="Add" fill="outline" shape="pill">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>

        <span>Large</span>
        <sl-button fill="outline" size="lg">Button</sl-button>
        <sl-button aria-label="Add" fill="outline" size="lg">
          <sl-icon name="far-plus"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="lg">Button</sl-button>
        <sl-button aria-label="Add" fill="outline" shape="pill" size="lg">
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

      <style>
        .inverted-showcase {
          background: var(--sl-color-foreground-accent-grey-bold);
          padding: 2rem;
          border-radius: var(--sl-size-borderRadius-default);
          margin-top: 2rem;
          display: grid;
          grid-template-columns: auto auto auto;
          gap: 1rem 2rem;
          align-items: center;
          justify-content: start;
        }
        .inverted-showcase > span {
          color: var(--sl-color-foreground-inverted-bold);
          font-weight: bold;
          justify-self: end;
        }
        .inverted-showcase > strong {
          color: var(--sl-color-foreground-inverted-bold);
          margin-bottom: 1rem;
        }
      </style>

      <section class="inverted-showcase">
        <span></span>
        <strong>Inverted Idle</strong>
        <strong>Inverted Disabled</strong>

        <span>Solid</span>
        <sl-button variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted" disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Outline</span>
        <sl-button variant="inverted" fill="outline">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted" fill="outline" disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Ghost</span>
        <sl-button variant="inverted" fill="ghost">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted" fill="ghost" disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Link</span>
        <sl-button variant="inverted" fill="link">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted" fill="link" disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
      </section>
    `;
  }
};
