import { announce } from '@sl-design-system/announcer';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { InlineMessage, type InlineMessageVariant } from './inline-message';

interface Props extends Pick<InlineMessage, 'indismissible' | 'size' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;

const variants: InlineMessageVariant[] = ['info', 'success', 'warning', 'danger'];

export default {
  title: 'Feedback & status/Inline message',
  tags: ['stable'],
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
    size: {
      control: 'inline-radio',
      options: ['auto', 'sm', 'md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: variants
    }
  },
  render: ({ body, button, indismissible, size, title, variant }) => html`
    <sl-inline-message ?indismissible=${indismissible} .size=${size ?? 'auto'} variant=${ifDefined(variant)}>
      ${title ? html`<span slot="title">${title}</span>` : nothing}
      ${button ? html`<sl-button fill="outline" slot="action" variant="info">${button}</sl-button>` : nothing}
      ${typeof body === 'string' ? body : body()}
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

      // Send an announcement with the text from the inline message.
      announce(`${title} ${count + 1}`);
    };

    const onRemove = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-button-bar')?.nextElementSibling?.remove();

      // Give user feedback the message is closed, either via the announcer or by setting the focus on another element.
      announce('Message closed');
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
      <h1>Announce changes</h1>
      <p>
        In this example app the functions adding and removing the inline message we use the
        <code>announce</code> function to announce the message and the fact that the message has been closed to users
        using a screenreader.
      </p>
      <p>
        When the message is closed using the close button in it (x) the announcement is done by the component itself.
        The component itself can't announce the showing of the message because it doesn't know if it is present on page
        load or added dynamically.
      </p>
    `;
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
    body: 'Duis laborum consectetur mollit deserunt nostrud anim occaecat elit ipsum laborum. Ad sit in anim aliqua laborum tempor. Labore cupidatat aute magna consectetur ullamco occaecat ea nostrud velit exercitation nulla est anim.'
  }
};

export const Sizes: Story = {
  render: ({ variant }) => html`
    <style>
      sl-inline-message {
        margin-block-end: 1rem;
      }
    </style>
    <sl-inline-message size="sm" variant=${ifDefined(variant)}>
      Small inline message
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
    <sl-inline-message size="md" variant=${ifDefined(variant)}>
      Medium inline message; If set explicitly (unlike auto), it will not grow automatically depending on the amount of
      content. Sit nostrud id non commodo nostrud voluptate nostrud sunt voluptate adipisicing.
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
    <sl-inline-message size="lg" variant=${ifDefined(variant)}>
      <span slot="title">Inline message title</span>
      Large inline message
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
    <sl-inline-message variant=${ifDefined(variant)}>
      Auto inline message is the same as md by default
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
    <sl-inline-message variant=${ifDefined(variant)}>
      Auto inline message will grow to large if the content span more than 2 lines; Sit nostrud id non commodo nostrud
      voluptate nostrud sunt voluptate adipisicing. Aliqua mollit eiusmod sunt enim enim tempor cillum labore commodo
      duis.
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
    <sl-inline-message variant=${ifDefined(variant)}>
      <span slot="title">Inline message title</span>
      Auto inline message will switch to large if a title is present.
      <sl-button fill="outline" slot="action">Action</sl-button>
    </sl-inline-message>
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
      sl-inline-message::part(title):first-letter {
        text-transform: capitalize;
      }
    </style>
    <div class="wrapper">
      <sl-inline-message indismissible>The main content of the message</sl-inline-message>
      <sl-inline-message>The main content of the message</sl-inline-message>
      <sl-inline-message>
        <sl-button fill="outline" slot="action">Action</sl-button>
        The main content of the message
      </sl-inline-message>
      <sl-inline-message indismissible>
        <sl-button fill="outline" slot="action">Action</sl-button>
        The main content of the message
      </sl-inline-message>
      <sl-inline-message>
        Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
        Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
      </sl-inline-message>
      <sl-inline-message>
        <sl-button fill="outline" slot="action">Action</sl-button>
        Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
        Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
      </sl-inline-message>
      <sl-inline-message>
        <span slot="title">
          "info" inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
        </span>
        <sl-button fill="outline" slot="action">Action</sl-button>
        Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
        consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
      </sl-inline-message>
      ${variants.map(
        variant => html`
          <sl-inline-message variant=${variant}>
            <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
            The main content of the message
          </sl-inline-message>
          <sl-inline-message variant=${variant}>
            <span slot="title">
              "info" inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
            </span>
            <sl-button fill="outline" slot="action" .variant=${variant}>Action</sl-button>
            Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non
            consequat eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
          </sl-inline-message>
        `
      )}
    </div>
  `
};
