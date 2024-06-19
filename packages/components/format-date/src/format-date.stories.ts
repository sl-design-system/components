import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { FormatDate } from './format-date';

interface Props extends FormatDate {
  fallback: string | TemplateResult;
}
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format date',
  tags: ['draft'],
  args: {
    fallback: 'Action',
    date: new Date,
  },
  argTypes: {
    fallback: {
      table: {
        disable: true
      }
    },
  },
  render: ({ fallback, date }) => html`
    date? ${date}
    <sl-format-date .date=${date}>
      ${fallback}
    </sl-format-date>
  `
} satisfies Meta<Props>;

// date=${new Date()}
// date='hj02/02/2022

export const Basic: Story = {
  args: {
    fallback: 'This is not a valid date',
  }
};

export const Details: Story = {
  args: {
    fallback: 'Details fallback'
  }
};

// TODO in All - examples of all in one place

// export const All: StoryObj = {
//   render: () => html`
//     <style>
//       #root-inner {
//         display: flex;
//         flex-direction: column;
//         gap: 1rem;
//         margin: 0 auto;
//         max-inline-size: min(600px, 80vw);
//       }
//       sl-inline-message::part(title):first-letter {
//         text-transform: capitalize;
//       }
//     </style>
//     <sl-inline-message indismissible>The main content of the message</sl-inline-message>
//     <sl-inline-message>The main content of the message</sl-inline-message>
//     <sl-inline-message>
//       <sl-button fill="outline" slot="action">Action</sl-button>
//       The main content of the message
//     </sl-inline-message>
//     <sl-inline-message indismissible>
//       <sl-button fill="outline" slot="action">Action</sl-button>
//       The main content of the message
//     </sl-inline-message>
//     <sl-inline-message>
//       Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
//       Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
//     </sl-inline-message>
//     <sl-inline-message>
//       <sl-button fill="outline" slot="action">Action</sl-button>
//       Duis deserunt ad quis Lorem. Consectetur non deserunt fugiat consequat pariatur amet commodo velit ut est sunt.
//       Exercitation culpa ea officia fugiat culpa laborum sit fugiat esse proident.
//     </sl-inline-message>
//     <sl-inline-message>
//       <span slot="title">
//         "info" inline message title esse laboris nisi ut quis ullamco dolor elit do commodo ea mollit eu irure.
//       </span>
//       <sl-button fill="outline" slot="action">Action</sl-button>
//       Duis ut magna commodo minim cillum voluptate incididunt ea labore adipisicing do ad anim. Incididunt non consequat
//       eiusmod aliqua consequat Lorem eu culpa labore aute laboris eiusmod.
//     </sl-inline-message>
//   `
// };


// TODO: make separated file with formatting date function
