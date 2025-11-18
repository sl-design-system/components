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

interface Props extends Pick<Callout, 'size' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;

const variants: CalloutVariant[] = ['info', 'positive', 'caution', 'negative'];

Icon.register(faArrowDownToLine, faArrowRightToBracket, fasFileSignature, fasShield);

export default {
  title: 'Feedback & status/Callout',
  tags: ['stable'],
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
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, size, title, variant }) => html`
    <sl-callout .size=${size} variant=${ifDefined(variant)}>
      ${title ? html`<span slot="title">${title}</span>` : nothing} ${typeof body === 'string' ? body : body()}
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
    body: () => html`A content of the callout.`
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

export const Sizes: Story = {
  render: ({ variant }) => html`
    <style>
      sl-callout {
        margin-block-end: 1rem;
      }
    </style>
    <sl-callout size="md" variant=${ifDefined(variant)}> Medium (default) callout component. </sl-callout>
    <sl-callout variant=${ifDefined(variant)}>
      <span slot="title">Callout title</span>
      Medium (default) callout component.
    </sl-callout>
    <sl-callout size="lg" variant=${ifDefined(variant)}>
      <span slot="title">Callout title</span>
      Large callout component.
    </sl-callout>
    <sl-callout size="lg" variant=${ifDefined(variant)}> Large callout component without title. </sl-callout>
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
    </style>
    <div class="container">
      <sl-callout size="md" variant="caution">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout size="lg" variant="caution">
        <sl-icon slot="icon" name="fas-shield"></sl-icon>
        <div class="content">
          Student data export requires encrypted storage.
          <sl-button fill="outline" variant="warning">
            <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
            View guide
          </sl-button>
        </div>
      </sl-callout>
      <sl-callout size="md" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <span slot="title">Field trip consent</span>
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
      <sl-callout size="lg" variant="info">
        <sl-icon slot="icon" name="fas-file-signature"></sl-icon>
        <span slot="title">Field trip consent</span>
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
            <span slot="title"> Callout title </span>
            The main content of the callout
          </sl-callout>
          <sl-callout size="lg" variant=${variant}> The main content of the callout </sl-callout>
          <sl-callout size="lg" variant=${variant}>
            <span slot="title">
              The "${variant}" callout title, esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu
              irure.
            </span>
            Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
            consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
          </sl-callout>
        `
      )}
    </div>
  `
};
