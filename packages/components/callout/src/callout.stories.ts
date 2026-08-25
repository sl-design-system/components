import { faArrowDownToLine, faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import {
  faFileSignature as fasFileSignature,
  faShield as fasShield
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { Callout, type CalloutVariant } from './callout.js';

interface Props extends Pick<Callout, 'density' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;

const variants: CalloutVariant[] = ['info', 'success', 'warning', 'danger'];

Icon.register(faArrowDownToLine, faArrowRightToBracket, fasFileSignature, fasShield);

export default {
  title: 'Layout/Callout',
  args: {
    variant: 'info'
  },
  argTypes: {
    body: {
      table: {
        disable: true
      }
    },
    button: {
      table: {
        disable: true
      }
    },
    density: {
      control: 'inline-radio',
      options: ['default', 'relaxed']
    },
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, density, title, variant }) => html`
    <style>
      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }
    </style>
    <sl-callout .density=${density} variant=${ifDefined(variant)}>
      ${title ? html`<h2 slot="title">${title}</h2>` : nothing}
      ${typeof body === 'string' ? body : body()}
    </sl-callout>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: 'The main content of the callout'
  }
};

export const Title: Story = {
  args: {
    title: 'Callout title',
    body: () => html`The content of the callout.`
  }
};

export const CustomIcon: Story = {
  args: {
    ...Basic.args,
    body: () => html`
      <sl-icon slot="icon" name="face-smile"></sl-icon>
      This example showcases how you can slot a different icon than the default one.
    `
  }
};

export const Overflow: Story = {
  args: {
    title:
      'Excepteur officia qui nisi commodo ullamco labore dolor ipsum eu non Lorem. Aute enim quis sit id laboris consequat nisi esse.',
    body: 'Duis laborum consectetur mollit deserunt nostrud anim occaecat elit ipsum laborum. Ad sit in anim aliqua laborum tempor. Labore cupidatat aute magna consectetur ullamco occaecat ea nostrud velit exercitation nulla est anim.'
  }
};

export const Density: Story = {
  render: ({ variant }) => html`
    <style>
      sl-callout {
        margin-block-end: 1rem;
      }

      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }
    </style>
    <sl-callout density="default" variant=${ifDefined(variant)}>
      Default callout component.
    </sl-callout>
    <sl-callout variant=${ifDefined(variant)}>
      <h2 slot="title">Callout title</h2>
      Default callout component.
    </sl-callout>
    <sl-callout density="relaxed" variant=${ifDefined(variant)}>
      <h2 slot="title">Callout title</h2>
      Relaxed callout component.
    </sl-callout>
    <sl-callout density="relaxed" variant=${ifDefined(variant)}>
      Relaxed callout component without title.
    </sl-callout>
  `
};

export const WithActions: Story = {
  render: () => html`
    <style>
      .container {
        max-width: 544px;
      }

      sl-callout {
        margin-block-end: 1rem;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      sl-callout sl-button {
        align-self: flex-start;
      }

      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }

      p {
        margin: 0;
      }
    </style>
    <div class="container">
      <sl-callout density="default" variant="warning">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout density="relaxed" variant="warning">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout density="default" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <h2 slot="title">Field trip consent</h2>
        <div class="content">
          <p>
            The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent
            form.
          </p>
          <p>
            Make sure you are prepared by checking the
            <a href="javascript:void(0)">trip details & packing list</a>.
          </p>
          <sl-button-bar>
            <sl-button fill="solid" variant="primary">
              <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
              Review & Sign
            </sl-button>
            <sl-button fill="outline" variant="info">
              <sl-icon name="far-arrow-down-to-line"></sl-icon>
              Download PDF
            </sl-button>
          </sl-button-bar>
        </div>
      </sl-callout>
      <sl-callout density="relaxed" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <h2 slot="title">Field trip consent</h2>
        <div class="content">
          <p>
            The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent
            form.
          </p>
          <p>
            Make sure you are prepared by checking the <a href="#">trip details & packing list</a>.
          </p>
          <sl-button-bar>
            <sl-button fill="solid" variant="primary">
              <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
              Review & Sign
            </sl-button>
            <sl-button fill="outline" variant="info">
              <sl-icon name="far-arrow-down-to-line"></sl-icon>
              Download PDF
            </sl-button>
          </sl-button-bar>
        </div>
      </sl-callout>
    </div>
  `
};

export const MultipleBackgrounds: StoryObj = {
  render: () => html`
    <style>
      .backgrounds {
        display: grid;
        gap: var(--sl-size-300);
      }

      .background {
        border-radius: var(--sl-size-borderRadius-default);
        display: grid;
        gap: var(--sl-size-150);
        padding: var(--sl-size-300);
      }

      .background--bold {
        background: var(--sl-color-background-primary-bold);
      }

      .background--pattern {
        background-color: var(--sl-color-background-accent-purple-bold);
        background-image:
          linear-gradient(135deg, rgb(255 255 255 / 18%) 25%, transparent 25%),
          linear-gradient(225deg, rgb(255 255 255 / 18%) 25%, transparent 25%),
          linear-gradient(45deg, rgb(0 0 0 / 12%) 25%, transparent 25%),
          linear-gradient(315deg, rgb(0 0 0 / 12%) 25%, transparent 25%);
        background-position:
          16px 0,
          16px 0,
          0 0,
          0 0;
        background-size: 32px 32px;
      }

      .background--image {
        background-image:
          linear-gradient(rgb(0 0 0 / 12%), rgb(0 0 0 / 12%)),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 320'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2300478f'/%3E%3Cstop offset='.55' stop-color='%233b8f72'/%3E%3Cstop offset='1' stop-color='%23f2b84b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='320' fill='url(%23sky)'/%3E%3Ccircle cx='640' cy='76' r='46' fill='%23fff0a8'/%3E%3Cpath d='M0 236 C100 188 174 220 260 176 C366 120 450 198 558 148 C650 106 724 132 800 96 L800 320 L0 320 Z' fill='%2300364c' opacity='.62'/%3E%3Cpath d='M0 278 C130 244 220 268 328 230 C428 195 528 250 640 218 C714 198 760 206 800 188 L800 320 L0 320 Z' fill='%231b5b49' opacity='.72'/%3E%3C/svg%3E");
        background-size: cover;
      }

      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }
    </style>
    <div class="backgrounds">
      ${[
        ['background--bold', 'Bold background'],
        ['background--pattern', 'Pattern background'],
        ['background--image', 'Image background']
      ].map(
        ([className, title]) => html`
          <section class="background ${className}">
            ${variants.map(
              variant => html`
                <sl-callout variant=${variant}>
                  <h2 slot="title">${title}</h2>
                  The callout text remains readable on complex backgrounds.
                </sl-callout>
              `
            )}
          </section>
        `
      )}
    </div>
  `
};

export const All: StoryObj = {
  render: () => html`
    <style>
      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 auto;
        max-inline-size: min(600px, 80vw);
      }

      sl-callout::part(title):first-letter {
        text-transform: capitalize;
      }
    </style>
    <div class="wrapper">
      ${variants.map(
        variant => html`
          <sl-callout variant=${variant}> The main content of the callout </sl-callout>
          <sl-callout variant=${variant}>
            <h2 slot="title">Callout title</h2>
            The main content of the callout
          </sl-callout>
          <sl-callout density="relaxed" variant=${variant}>
            The main content of the callout
          </sl-callout>
          <sl-callout density="relaxed" variant=${variant}>
            <h2 slot="title">
              The "${variant}" callout title, esse laboris nisi ut quis ullamco dolor elit do
              commodo ea mollit eu irure.
            </h2>
            <p>
              Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad
              anim. Incididunt non consequat eiusmod aliqua consequat Lorem eu culpa
              <a href="#">aute laboris eiusmod</a>.
            </p>
          </sl-callout>
        `
      )}
    </div>
  `
};
