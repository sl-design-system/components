import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { Callout, type CalloutVariant } from './callout';

interface Props extends Pick<Callout, 'indismissible' | 'size' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;

const variants: CalloutVariant[] = ['info', 'success', 'warning', 'danger'];

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
  render: ({ body, indismissible, size, title, variant }) => html`
    <sl-callout ?indismissible=${indismissible} .size=${size ?? 'auto'} variant=${ifDefined(variant)}>
      ${title ? html`<span slot="title">${title}</span>` : nothing} ${typeof body === 'string' ? body : body()}
    </sl-callout>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: 'The main content of the message'
  }
};

export const Details: Story = {
  args: {
    title: 'Inline message title',
    body: () => html`
      <style>
        p {
          margin-block: 0 0.5rem;
        }
        ul {
          list-style-position: inside;
          margin: 0;
          padding: 0;
        }
      </style>
      <p>The main content of the message</p>
      <ul>
        <li>Error 1</li>
        <li>Error 2</li>
        <li>Error 3</li>
        <li>Error 4</li>
      </ul>
    `
  }
};

export const Icon: Story = {
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
    <sl-callout size="sm" variant=${ifDefined(variant)}> Small inline message </sl-callout>
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
      <sl-callout indismissible>The main content of the message</sl-callout>
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
