import type { Preview } from '@storybook/web-components';
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { updateTheme, themes } from '../../.storybook/themes';
import { withThemeByClassName, withThemeFromJSXProvider } from '@storybook/addon-themes';
import { html } from 'lit';

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
      </style>
      <h1>State: Default <small>(including "disabled")</small></h1>
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
    },
    (story) => {
      withThemeFromJSXProvider({
        themes: {
          bingelDc: themes['bingel-dc'],
          bingelInt: themes['bingel-int'],
          clickedu: themes['clickedu'],
          editorialSuite: themes['editorial-suite'],
          itslearning: themes['itslearning'],
          kampus: themes['kampus'],
          magister: themes['magister'],
          max: themes['max'],
          myDigitalBook: themes['my-digital-book'],
          myvanin: themes['myvanin'],
          neon: themes['neon'],
          nowaEra: themes['nowa-era'],
          sanomaLearning: themes['sanoma-learning'],
          sanomaUtbildning: themes['sanoma-utbildning'],
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
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

export default preview;
