import { faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import { faShield as fasShield } from '@fortawesome/pro-solid-svg-icons';
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

const variants: CalloutVariant[] = ['info', 'success', 'warning', 'danger'];

Icon.register(faArrowRightToBracket, fasShield);

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
      options: ['auto', 'sm', 'md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, size, title, variant }) => html`
    <sl-callout .size=${size ?? 'auto'} variant=${ifDefined(variant)}>
      ${title ? html`<span slot="title">${title}</span>` : nothing} ${typeof body === 'string' ? body : body()}
    </sl-callout>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: 'The main content of the message'
  }
};

export const Title: Story = {
  args: {
    title: 'Inline message title',
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
    <sl-callout size="md" variant=${ifDefined(variant)}>
      Medium inline message; If set explicitly (unlike auto), it will not grow automatically depending on the amount of
      content. Sit nostrud id non commodo nostrud voluptate nostrud sunt voluptate adipisicing.
    </sl-callout>
    <sl-callout size="lg" variant=${ifDefined(variant)}>
      <span slot="title">Inline message title</span>
      Large inline message
    </sl-callout>
    <sl-callout variant=${ifDefined(variant)}> Auto inline message is the same as md by default </sl-callout>
    <sl-callout variant=${ifDefined(variant)}>
      Auto inline message will grow to large if the content span more than 2 lines; Sit nostrud id non commodo nostrud
      voluptate nostrud sunt voluptate adipisicing. Aliqua mollit eiusmod sunt enim enim tempor cillum labore commodo
      duis.
    </sl-callout>
    <sl-callout variant=${ifDefined(variant)}>
      <span slot="title">Inline message title</span>
      Auto inline message will switch to large if a title is present.
    </sl-callout>
  `
};

export const WithActions: Story = {
  render: () => html`
    <style>
      sl-callout {
        margin-block-end: 1rem;
        max-inline-size: 544px;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      sl-callout sl-button {
        /* margin-block-start: 0.5rem; */
        align-self: flex-start;
      }
    </style>
    <sl-callout size="md" variant="warning">
      <sl-icon slot="icon" name="fas-shield"></sl-icon>
      <div class="content">
        Student data export requires encrypted storage.
        <sl-button fill="outline" variant="warning">
          <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
          View guide
        </sl-button>
      </div>
    </sl-callout>
    <sl-callout size="lg" variant="warning">
      <sl-icon slot="icon" name="fas-shield"></sl-icon>
      <span slot="title">Inline message title</span>
      <div class="content">
        Student data export requires encrypted storage.
        <sl-button fill="outline" variant="warning">
          <sl-icon name="far-arrow-right-to-bracket"></sl-icon>
          View guide
        </sl-button>
      </div>
    </sl-callout>
    <sl-callout size="md" variant="info">
      <span slot="title">Field trip consent</span>
      <div class="content">
        The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent form. <br />
        <p>
          View trip details & packing list checking this
          <sl-button fill="link" variant="info">LINK</sl-button>
        </p>
        <sl-button fill="solid" variant="primary">Review & Sign</sl-button>
        <sl-button fill="outline" variant="info">Download PDF</sl-button>
      </div>
    </sl-callout>
    <sl-callout size="lg" variant="info">
      <span slot="title">Field trip consent</span>
      <div class="content">
        The 6th-grade museum visit is on 21 Nov. Please review the details and submit a consent form.
        <sl-button fill="solid" variant="primary">Review & Sign</sl-button>
        <sl-button fill="outline" variant="info">Download PDF</sl-button>
      </div>
    </sl-callout>
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
      <sl-callout>The main content of the message</sl-callout>
      <sl-callout>
        Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
        Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
      </sl-callout>
      ${variants.map(
        variant => html`
          <sl-callout variant=${variant}> The main content of the message </sl-callout>
          <sl-callout variant=${variant}>
            <span slot="title">
              "info" inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
            </span>
            Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
            consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
          </sl-callout>
        `
      )}
    </div>
  `
};

// TODO: add a story with more complex content and actions
