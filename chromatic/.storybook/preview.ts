import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { type Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { html } from 'lit';
import { themes, updateTheme, type Mode } from '../../.storybook/themes';
import MockDate from 'mockdate';

// Id's of components that only need to be rendered once, not in all mock states.
const singleState = [
  'all--badge',
  'all--calendar',
  'all--card',
  'all--dialog',
  'all--icon',
  'all--inline-message',
  'all--message-dialog',
  'all--month-view',
  'all--popover',
  'all--select-day',
  'all--select-month',
  'all--select-year',
  'all--skeleton',
  'all--spinner',
  'all--tooltip'
];

if (!import.meta.env?.DEV) {
  MockDate.set('2025-06-01T00:00:00Z');
}

const preview: Preview = {
  decorators: [
    (story, { globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      updateTheme(theme, mode as Mode);

      return story();
    },
    (story, data) => {
      return html`
      <style>
        h1:not(:first-of-type) {
          margin-top: 40px;
          border-top: 1px solid currentColor;
          padding-top: 24px;
        }

        #root-inner{
          max-width: 1280px;
          padding: 16px;
        }
      </style>
      ${singleState.includes(data.id)
          ? story()
          : html`<h1>State: Default <small>(including "disabled")</small></h1>
            ${story()}
            <h1>State: Hover</h1>
            <div class="sb-fake-hover">
              ${story()}
            </div>
            <h1>State: Active</h1>
            <div class="sb-fake-active">
              ${story()}
            </div>
            <h1>State: Focus</h1>
            <div class="sb-fake-focus-visible">
              ${story()}
            </div>
            `
        }`
    },
    (story) => {
      withThemeFromJSXProvider({
        themes: Object.fromEntries(themes.map(t => [t.id, t])),
        defaultTheme: 'sanoma-learning'
      });

      return story();
    },
  ],
  parameters: {
    pseudo: {
      hover: '.sb-fake-hover *',
      active: '.sb-fake-active *',
      focusVisible: '.sb-fake-focus-visible *',
    },
    options: {
      storySort: {
        method: 'alphabetical'
      }
    },
    a11y: {
      options: {
        preload: false
      }
    }
  }
};

export default preview;
