import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
// import { type InlineMessageVariant } from './inline-message';
import { FormatDate, type InlineMessageVariant } from './format-date';

interface Props extends Pick<FormatDate, 'indismissible' | 'variant'> {
  title: string;
  button: string;
  body: string | TemplateResult;
}
type Story = StoryObj<Props>;

const variants: InlineMessageVariant[] = ['info', 'success', 'warning', 'danger'];

export default {
  title: 'Components/Format date',
  tags: ['draft'],
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
    <sl-format-date ?indismissible=${indismissible} .variant=${variant}>
      ${title ? html`<span slot="title">${title}</span>` : nothing}
      ${button ? html`<sl-button fill="outline" slot="action" variant="info">${button}</sl-button>` : nothing} ${body}
    </sl-format-date>
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
    <sl-inline-message indismissible variant="info">The main content of the message</sl-inline-message>
    <sl-inline-message variant="info">The main content of the message</sl-inline-message>
    <sl-inline-message variant="info">
      <sl-button fill="outline" slot="action" variant="info">Action</sl-button>
      The main content of the message
    </sl-inline-message>
    <sl-inline-message indismissible variant="info">
      <sl-button fill="outline" slot="action" variant="info">Action</sl-button>
      The main content of the message
    </sl-inline-message>
    <sl-inline-message variant="info">
      Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
      Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
    </sl-inline-message>
    <sl-inline-message variant="info">
      <sl-button fill="outline" slot="action" variant="info">Action</sl-button>
      Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
      Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
    </sl-inline-message>
    <sl-inline-message variant="info">
      <span slot="title">
        "info" inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
      </span>
      <sl-button fill="outline" slot="action" variant="info">Action</sl-button>
      Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non consequat
      eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
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
  `
};
