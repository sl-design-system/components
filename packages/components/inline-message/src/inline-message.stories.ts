import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { InlineMessage, type InlineMessageVariant } from './inline-message';

interface Props extends Pick<InlineMessage, 'indismissible' | 'variant'> {
  title: string;
  button: string;
  body: string | TemplateResult;
}
type Story = StoryObj<Props>;

const variants: InlineMessageVariant[] = ['info', 'success', 'warning', 'danger'];

export default {
  title: 'Components/Inline message',
  tags: ['preview'],
  args: {
    button: 'Action',
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
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, button, indismissible, title, variant }) => html`
    <sl-inline-message ?indismissible=${indismissible} .variant=${variant}>
      ${title ? html`<span slot="title">${title}</span>` : nothing}
      ${button ? html`<sl-button fill="outline" slot="action" variant="info">${button}</sl-button>` : nothing} ${body}
    </sl-inline-message>
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
    body: html`
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

export const Dynamic: Story = {
  args: {
    ...Basic.args,
    title: 'Dynamic inline message title'
  },
  render: ({ body, indismissible, title, variant }) => {
    const onAdd = (event: Event & { target: HTMLElement }): void => {
      const buttonBar = event.target.closest('sl-button-bar'),
        count = buttonBar?.parentElement?.querySelectorAll('sl-inline-message').length ?? 0;

      const msg = document.createElement('sl-inline-message');
      msg.indismissible = indismissible;
      msg.innerHTML = `<span slot="title">${title} ${count + 1}</span>${body as string}`;
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

export const NoTitle: Story = {
  args: {
    ...Basic.args,
    title: undefined
  }
};

export const Overflow: Story = {
  args: {
    title:
      'Excepteur officia qui nisi commodo ullamco labore dolor ipsum eu non Lorem. Aute enim quis sit id laboris consequat nisi esse.',
    body: 'Duis laborum consectetur mollit deserunt nostrud anim occaecat elit ipsum laborum. Ad sit in anim aliqua laborum tempor. Labore cupidatat aute magna consectetur ullamco occaecat ea nostrud velit exercitation nulla est anim.'
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
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 auto;
        max-inline-size: min(600px, 80vw);
      }
      sl-inline-message::part(title):first-letter {
        text-transform: capitalize;
      }
    </style>
    ${variants.map(
      variant => html`
        <sl-inline-message indismissible variant=${variant}>The main content of the message</sl-inline-message>
        <sl-inline-message variant=${variant}>The main content of the message</sl-inline-message>
        <sl-inline-message variant=${variant}>
          <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
          The main content of the message
        </sl-inline-message>
        <sl-inline-message indismissible variant=${variant}>
          <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
          The main content of the message
        </sl-inline-message>
        <sl-inline-message variant=${variant}>
          Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est
          sunt. Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
        </sl-inline-message>
        <sl-inline-message variant=${variant}>
          <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
          Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est
          sunt. Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
        </sl-inline-message>
        <sl-inline-message variant=${variant}>
          <span slot="title">
            ${variant} inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
          </span>
          <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
          Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
          consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
        </sl-inline-message>
      `
    )}
  `
};
