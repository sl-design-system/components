import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { updateTheme, themes } from '../../.storybook/themes';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { html } from 'lit';

// Id's of components that only need to be rendered once, not in all mock states.
const singleState = [
  'all--dialog',
  'all--message-dialog', 
  'all--badge',
  'all--card',
  'all--icon',
  'all--inline-message',
  'all--popover',
  'all--skeleton',
  'all--spinner',
  'all--tooltip'
];

const preview: Preview = {
  decorators: [

    (story, { globals: { mode = 'light', theme = 'sanoma-learning' } }) => {
      updateTheme(theme, mode);

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
      ${
        singleState.includes(data.id)
          ?story()
          :html`<h1>State: Default <small>(including "disabled")</small></h1>
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
            </div>`
      }`      
    },
    (story) => {
      withThemeFromJSXProvider({
        themes: {
          'bingel-dc': themes['bingel-dc'],
          'bingel-int': themes['bingel-int'],
          clickedu: themes['clickedu'],
          'editorial-suite': themes['editorial-suite'],
          itslearning: themes['itslearning'],
          kampus: themes['kampus'],
          magister: themes['magister'],
          max: themes['max'],
          'my-digital-book': themes['my-digital-book'],
          myvanin: themes['myvanin'],
          neon: themes['neon'],
          // 'nowa-era': themes['nowa-era'],
          'sanoma-learning': themes['sanoma-learning'],
          'sanoma-utbildning': themes['sanoma-utbildning'],
          teas: themes['teas'],
        },
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
    }
  }
};

export default preview;
