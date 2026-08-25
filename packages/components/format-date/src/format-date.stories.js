import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
const locales = ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv'];
export default {
  title: 'Utilities/Format date',
  args: {
    fallback: 'invalid date',
    dateStyle: 'long',
    timeStyle: 'medium'
  },
  argTypes: {
    date: { control: 'date' },
    dateStyle: {
      control: 'inline-radio',
      options: ['full', 'long', 'medium', 'short', void 0]
    },
    locale: {
      control: 'inline-radio',
      options: locales
    },
    timeStyle: {
      control: 'inline-radio',
      options: ['full', 'long', 'medium', 'short', void 0]
    },
    year: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', void 0]
    },
    month: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', 'narrow', 'short', 'long', void 0]
    },
    day: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', void 0]
    },
    weekday: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', void 0]
    },
    dayPeriod: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', void 0]
    },
    hour: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', void 0]
    },
    minute: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', void 0]
    },
    second: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', void 0]
    },
    timeZoneName: {
      control: 'inline-radio',
      options: ['short', 'long', void 0]
    },
    timeZone: { control: 'text' },
    hour12: {
      control: 'boolean'
    },
    era: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', void 0]
    }
  },
  render: ({
    fallback,
    date,
    locale,
    dateStyle,
    timeStyle,
    weekday,
    era,
    year,
    month,
    day,
    dayPeriod,
    hour,
    minute,
    second,
    timeZoneName,
    timeZone,
    hour12
  }) => html`
    <sl-format-date
      .date=${date}
      .dateStyle=${dateStyle}
      .timeStyle=${timeStyle}
      .weekday=${weekday}
      .era=${era}
      .year=${year}
      .month=${month}
      .day=${day}
      .dayPeriod=${dayPeriod}
      .hour=${hour}
      .minute=${minute}
      .second=${second}
      .timeZoneName=${timeZoneName}
      .timeZone=${timeZone}
      .hour12=${hour12}
      locale=${ifDefined(locale)}>
      ${fallback}
    </sl-format-date>
  `
};
export const Basic = {
  args: {
    date: /* @__PURE__ */ new Date()
  }
};
export const Fallback = {
  args: {
    fallback:
      'You can use the fallback slot to provide a message when the date is not valid (this includes when a date is not set). This can be useful if you want to show a placeholder or an error message.'
  }
};
export const Locales = {
  args: {
    date: /* @__PURE__ */ new Date()
  },
  argTypes: {
    locale: { table: { disable: true } }
  },
  render: ({
    fallback,
    date,
    dateStyle,
    timeStyle,
    weekday,
    era,
    year,
    month,
    day,
    dayPeriod,
    hour,
    minute,
    second,
    timeZoneName,
    timeZone,
    hour12
  }) => html`
    <style>
      dl {
        display: inline-grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem 1rem;
      }
    </style>
    <dl>
      ${locales.map(
        locale => html`
          <dt>${locale}</dt>
          <dd>
            <sl-format-date
              .date=${date}
              .dateStyle=${dateStyle}
              .timeStyle=${timeStyle}
              .weekday=${weekday}
              .era=${era}
              .year=${year}
              .month=${month}
              .day=${day}
              .dayPeriod=${dayPeriod}
              .hour=${hour}
              .minute=${minute}
              .second=${second}
              .timeZoneName=${timeZoneName}
              .timeZone=${timeZone}
              .hour12=${hour12}
              locale=${locale}>
              ${fallback}
            </sl-format-date>
          </dd>
        `
      )}
    </dl>
  `
};
//# sourceMappingURL=format-date.stories.js.map
