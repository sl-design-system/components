import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { InlineMessage, type InlineMessageVariant } from './inline-message';

interface Props extends Pick<InlineMessage, 'indismissible' | 'variant'> {
  title: string;
  body: string | TemplateResult;
  details: string | TemplateResult;
}
type Story = StoryObj<Props>;

const variants: InlineMessageVariant[] = ['info', 'success', 'warning', 'danger'];

export default {
  title: 'Components/Inline message',
  args: {
    body: 'The main content of the message',
    details: 'A place for details like errors list',
    variant: 'info'
  },
  argTypes: {
    body: {
      table: {
        disable: true
      }
    },
    details: {
      table: {
        disable: true
      }
    },
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, details, indismissible, title, variant }) => html`
    <sl-inline-message ?indismissible=${indismissible} .variant=${variant}>
      <span slot="title">${title}</span>
      ${body}
      <div slot="details">${details}</div>
    </sl-inline-message>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    title: 'Inline message title',
    body: 'The main content of the message'
  }
};

export const Details: Story = {
  args: {
    ...Basic.args,
    details: html`
      <ul>
        <li>Error 1</li>
        <li>Error 2</li>
        <li>Error 3</li>
        <li>Error 4</li>
      </ul>
    `
  }
};

export const Dynamic: Story = {
  args: {
    ...Basic.args
  },
  render: ({ body, details, indismissible, title, variant }) => {
    const onAdd = (event: Event & { target: HTMLElement }): void => {
      const buttonBar = event.target.closest('sl-button-bar'),
        count = buttonBar?.parentElement?.querySelectorAll('sl-inline-message').length ?? 0;

      const msg = document.createElement('sl-inline-message');
      msg.indismissible = indismissible;
      msg.innerHTML = `<span slot="title">${title} ${count + 1}</span>${body as string}<div slot="details">${details as string}</div>`;
      msg.variant = variant;

      buttonBar?.after(msg);
    };

    const onRemove = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-button-bar')?.nextElementSibling?.remove();
    };

    return html`
      <style>
        sl-button-bar {
          margin-block-end: 1.5rem;
        }
        sl-inline-message + sl-inline-message {
          margin-block-start: 1rem;
        }
      </style>
      <sl-button-bar>
        <sl-button @click=${onAdd}>Add message</sl-button>
        <sl-button @click=${onRemove}>Remove message</sl-button>
      </sl-button-bar>
    `;
  }
};

export const Indismissible: Story = {
  args: {
    ...Basic.args,
    indismissible: true
  }
};

export const Overflow: Story = {
  args: {
    title:
      'Excepteur officia qui nisi commodo ullamco labore dolor ipsum eu non Lorem. Aute enim quis sit id laboris consequat nisi esse.',
    body: 'Duis laborum consectetur mollit deserunt nostrud anim occaecat elit ipsum laborum. Ad sit in anim aliqua laborum tempor. Labore cupidatat aute magna consectetur ullamco occaecat ea nostrud velit exercitation nulla est anim.',
    details:
      'Sunt non cupidatat elit magna irure tempor. Nulla proident amet voluptate amet et dolore dolore ut enim eiusmod. Consequat proident amet sint dolor et aliqua eiusmod.'
  }
};

export const CustomIcon: Story = {
  args: {
    ...Basic.args,
    body: html`
      <sl-icon slot="icon" name="face-smile"></sl-icon>
      The main content of the message
    `
  }
};

export const All: StoryObj = {
  render: () => html`
    <style>
      #root-inner {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
      }
      span[slot='title']:first-letter {
        text-transform: capitalize;
      }
    </style>
    ${variants.map(
      variant => html`
        <sl-inline-message variant=${variant}>
          <span slot="title">${variant} inline message title</span>
          The main content of the message
          <span slot="details">A place fore more details like errors list</span>
        </sl-inline-message>
        <sl-inline-message indismissible variant=${variant}>
          <span slot="title">${variant} inline message title</span>
          The main content of the message
          <span slot="details">A place fore more details like errors list</span>
        </sl-inline-message>
      `
    )}
  `
};
