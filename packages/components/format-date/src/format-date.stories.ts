import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { FormatDate } from './format-date';
import {formatDateTime} from "./format-date-time";

interface Props extends FormatDate {
  fallback: string | TemplateResult;
  // body: string | TemplateResult;
  // date: Date | number | string | undefined;
}
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format date',
  tags: ['draft'],
  args: {
    fallback: 'invalid date',
    locale: 'en',
  },
  argTypes: {
    date: { control: 'date' },
    fallback: {
      table: {
        disable: true
      }
    },
    year: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    month: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', 'narrow', 'short', 'long']
    },
    day: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    weekday: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long']
    },
    hour: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    minute: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    second: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    timeZoneName: {
      control: 'inline-radio',
      options: ['short', 'long']
    },
    timeZone: { control: 'text' },
    hour12: {
      control: 'inline-radio',
      options: ['undefined', 'true', 'false']
    },
    era: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long']
    },
  },
  render: ({ fallback,
             date,
             locale,
             weekday,
             era,
             year,
             month,
             day,
             hour,
             minute,
             second,
             timeZoneName,
             timeZone,
             hour12 }) => html`
    <sl-format-date
      .date=${date}
      .locale=${locale}
      .weekday=${weekday}
      .era=${era}
      .year=${year}
      .month=${month}
      .day=${day}
      .hour=${hour}
      .minute=${minute}
      .second=${second}
      .timeZoneName=${timeZoneName}
      .timeZone=${timeZone}
      .hour12=${hour12}>
      ${fallback}
    </sl-format-date>
  `
} satisfies Meta<Props>;

// date=${new Date()}
// date='hj02/02/2022

// hour12

export const Basic: Story = {
  args: {
    date: new Date,
    fallback: 'This is not a valid date',
  }
};

export const InvalidDate: Story = {
  args: {
    fallback: 'This date is not valid and I cannot render it.',
    // date: 'nothing',
  }
};

export const Function: StoryObj = {
  render: ({ date,
             locale,
             weekday,
             era,
             year,
             month,
             day,
             hour,
             minute,
             second,
             timeZoneName,
             timeZone,
             hour12 }) => {
    // const options = { date,
    //   locale,
    //   weekday,
    //   era,
    //   year,
    //   month,
    //   day,
    //   hour,
    //   minute,
    //   second,
    //   timeZoneName,
    //   timeZone,
    //   hour12 };
    // const formattedDate = formatDateTime(date ? date : new Date, locale, options);

    try {
      const options = { date,
        locale,
        weekday,
        era,
        year,
        month,
        day,
        hour,
        minute,
        second,
        timeZoneName,
        timeZone,
        hour12 };
      const formattedDate = formatDateTime(date ? date : new Date, locale, options);
      return html`
      <article>This is a value rendered with function <code>formatDateTime</code>
        <div style="font-size: 20px;">
          ${formattedDate ? formattedDate : nothing}
        </div>
      </article>
  `
    } catch {
      return html`Something went wrong. Please check function parameters.`
    }
}
};

// TODO in All - examples of all in one place

// TODO: add example with just function usage

// TODO: 12h not working !!!!!!

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
