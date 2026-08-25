import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Utilities/Emoji browser',
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    locale: 'en'
  },
  argTypes: {
    frequentlyUsed: {
      type: 'string'
    },
    query: {
      type: 'string'
    }
  },
  render: ({ frequentlyUsed, locale, query }) => {
    return html`
      <sl-emoji-browser
        base-url="/emoji"
        frequently-used=${ifDefined(frequentlyUsed)}
        locale=${ifDefined(locale)}
        query=${ifDefined(query)}
        style="height: 100dvh"></sl-emoji-browser>
    `;
  }
};
export const Basic = {};
export const FrequentlyUsed = {
  args: {
    frequentlyUsed: '\u{1F600} \u{1F602} \u{1F60E} \u{1F914} \u{1F937}\u200D\u2642\uFE0F'
  }
};
export const Search = {
  args: {
    query: 'point'
  }
};
//# sourceMappingURL=emoji-browser.stories.js.map
