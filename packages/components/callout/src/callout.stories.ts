import { faArrowDownToLine, faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import { faFileSignature as fasFileSignature, faShield as fasShield } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { Callout, type CalloutVariant } from './callout';

interface Props extends Pick<Callout, 'density' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;

const variants: CalloutVariant[] = ['info', 'positive', 'caution', 'negative'];

Icon.register(faArrowDownToLine, faArrowRightToBracket, fasFileSignature, fasShield);

export default {
  title: 'Feedback & status/Callout',
  tags: ['draft'],
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
      options: ['plain', 'comfortable']
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
      ${title ? html`<h2 slot="title">${title}</h2>` : nothing} ${typeof body === 'string' ? body : body()}
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
    <sl-callout density="plain" variant=${ifDefined(variant)}> Plain (default) callout component. </sl-callout>
    <sl-callout variant=${ifDefined(variant)}>
      <h2 slot="title">Callout title</h2>
      Plain (default) callout component.
    </sl-callout>
    <sl-callout density="comfortable" variant=${ifDefined(variant)}>
      <h2 slot="title">Callout title</h2>
      Comfortable callout component.
    </sl-callout>
    <sl-callout density="comfortable" variant=${ifDefined(variant)}>
      Comfortable callout component without title.
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

      .link-info {
        align-items: center;
        display: inline-flex;
        gap: 4px;
      }

      .actions {
        display: flex;
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
    </style>
    <div class="container">
      <sl-callout density="plain" variant="caution">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout density="comfortable" variant="caution">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout density="plain" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <h2 slot="title">Field trip consent</h2>
        <div class="content">
          The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent form. <br />
          <div class="link-info">
            View trip details & packing list checking this
            <sl-button fill="link" variant="info">LINK</sl-button>
          </div>
          <div class="actions">
            <sl-button fill="solid" variant="primary">
              <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
              Review & Sign
            </sl-button>
            <sl-button fill="outline" variant="info">
              <sl-icon name="far-arrow-down-to-line"></sl-icon>
              Download PDF
            </sl-button>
          </div>
        </div>
      </sl-callout>
      <sl-callout density="comfortable" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <h2 slot="title">Field trip consent</h2>
        <div class="content">
          The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent form. <br />
          <div class="link-info">
            View trip details & packing list checking this
            <sl-button fill="link" variant="info">LINK</sl-button>
          </div>
          <div class="actions">
            <sl-button fill="solid" variant="primary">
              <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
              Review & Sign
            </sl-button>
            <sl-button fill="outline" variant="info">
              <sl-icon name="far-arrow-down-to-line"></sl-icon>
              Download PDF
            </sl-button>
          </div>
        </div>
      </sl-callout>
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
          <sl-callout density="comfortable" variant=${variant}> The main content of the callout </sl-callout>
          <sl-callout density="comfortable" variant=${variant}>
            <h2 slot="title">
              The "${variant}" callout title, esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu
              irure.
            </h2>
            Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
            consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
          </sl-callout>
        `
      )}
    </div>
  `
};
