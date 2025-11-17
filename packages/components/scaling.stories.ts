import { faElephant, faFrog, faRabbit } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/button/register.js';
import '../components/button-bar/register.js';
import '../components/form/register.js';
import '../components/icon/register.js';
import '../components/panel/register.js';
import '../components/tabs/register.js';
import '../components/text-field/register.js';

type Story = StoryObj;
const densities = ['compact', 'default', 'relaxed'];
const audiences = ['early', 'developing', 'advanced'];
const devices = ['mobile', 'tablet', 'desktop', 'digiboard'];

export default {
  title: 'Scaling',
  args: {
    audience: 'early',
    density: 'default',
    device: 'desktop',
    factorFontEarly: 20,
    factorFontDeveloping: 16,
    factorFontAdvanced: 14,
    factorSpaceEarly: 20,
    factorSpaceAdvanced: 16,
    factorMobile: 1.2,
    factorTablet: 1.1,
    factorDesktop: 1,
    factorDigiboard: 1.5
  },
  argTypes: {
    density: {
      control: 'radio',
      options: densities
    },
    audience: {
      control: 'radio',
      options: audiences
    },
    device: {
      control: 'radio',
      options: devices
    },
    factorSpaceEarly: {
      control: 'number'
    },
    factorSpaceAdvanced: {
      control: 'number'
    },
    factorFontEarly: {
      control: 'number'
    },
    factorFontDeveloping: {
      control: 'number'
    },
    factorFontAdvanced: {
      control: 'number'
    },
    factorMobile: {
      control: 'number'
    },
    factorTablet: {
      control: 'number'
    },
    factorDesktop: {
      control: 'number'
    },
    factorDigiboard: {
      control: 'number'
    }
  }
} satisfies Meta;

Icon.register(faFrog, faRabbit, faElephant);

export const Basic: Story = {
  render: ({
    density,
    device,
    audience,
    factorSpaceEarly,
    factorSpaceAdvanced,
    factorFontEarly,
    factorFontDeveloping,
    factorFontAdvanced,
    factorMobile,
    factorTablet,
    factorDesktop,
    factorDigiboard
  }) => html`
    <style>
      :root {
        --_device-scale: ${device === 'mobile'
          ? factorMobile
          : device === 'tablet'
            ? factorTablet
            : device === 'desktop'
              ? factorDesktop
              : factorDigiboard};
        --_audience-scale: calc(
          ${audience === 'early' ? factorSpaceEarly / 16 : factorSpaceAdvanced / 16} * var(--_device-scale)
        );
        --_font-size: ${audience === 'early'
          ? factorFontEarly
          : audience === 'developing'
            ? factorFontDeveloping
            : factorFontAdvanced}px;
      }
      sl-panel {
        font-size: var(--_font-size);
        max-width: 500px;
        line-height: 1.2em;
      }
      section {
        display: flex;
        flex-direction: column;
        gap: var(--sl-panel-content-padding);
      }
      sl-button-bar {
        justify-content: space-between;
      }
    </style>
    <sl-panel .density=${density} heading="${density} panel">
      ${audience} readers
      <hr />
      <section>
        <p>
          Spacing in a design system ensures visual consistency and balance across all components and layouts. It
          defines clear rules for padding, margins, and gaps, helping to create harmony between elements. A structured
          spacing scale maintains predictable proportions throughout the interface and supports flexible layouts.
          Consistent spacing enhances readability, usability, and overall visual coherence. By defining spacing through
          design tokens, teams can apply and adjust values systematically across platforms and products.
        </p>
        <sl-tab-group>
          <sl-tab selected>First tab</sl-tab>
          <sl-tab>Second tab</sl-tab>
          <sl-tab disabled>Third tab</sl-tab>
        </sl-tab-group>
        <sl-form>
          <sl-form-field label="Label">
            <sl-text-field></sl-text-field>
          </sl-form-field>
        </sl-form>
        <sl-button-bar>
          <sl-button size="sm"><sl-icon name="far-frog"></sl-icon>button</sl-button>
          <sl-button size="md"><sl-icon name="far-rabbit"></sl-icon>button</sl-button>
          <sl-button size="lg"><sl-icon name="far-elephant"></sl-icon>button</sl-button>
        </sl-button-bar>
      </section>
    </sl-panel>
  `
};
