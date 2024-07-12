import { faBold, faItalic, faUnderline } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ButtonGroup } from './button-group.js';

type Props = Pick<ButtonGroup, 'disabled' | 'size'> & { slot?(): TemplateResult };
type Story = StoryObj<Props>;

Icon.register(faBold, faItalic, faUnderline);

export default {
  title: 'Components/Button group',
  tags: ['draft'],
  args: {
    disabled: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    slot: {
      table: { disable: true }
    }
  },
  render: ({ disabled, size, slot }) => {
    return html`<sl-button-group ?disabled=${disabled} size=${ifDefined(size)}>${slot?.()}</sl-button-group>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    slot: () => html`
      <sl-button aria-label="Bold">
        <sl-icon name="far-bold"></sl-icon>
      </sl-button>
      <sl-button aria-label="Italic">
        <sl-icon name="far-italic"></sl-icon>
      </sl-button>
      <sl-button aria-label="Underline">
        <sl-icon name="far-underline"></sl-icon>
      </sl-button>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Text: Story = {
  args: {
    slot: () => html`
      <sl-button>Lorem</sl-button>
      <sl-button>Ipsum</sl-button>
      <sl-button>Dolar</sl-button>
    `
  }
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <sl-button-bar>
      <sl-button-group size="sm">
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>

      <sl-button-group disabled>
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>
    </sl-button-bar>

    <sl-button-bar>
      <sl-button-group>
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>

      <sl-button-group disabled>
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>
    </sl-button-bar>

    <sl-button-bar>
      <sl-button-group size="lg">
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>

      <sl-button-group disabled>
        <sl-button aria-label="Bold">
          <sl-icon name="far-bold"></sl-icon>
        </sl-button>
        <sl-button aria-label="Italic">
          <sl-icon name="far-italic"></sl-icon>
        </sl-button>
        <sl-button aria-label="Underline">
          <sl-icon name="far-underline"></sl-icon>
        </sl-button>
      </sl-button-group>
    </sl-button-bar>
  `
};
