import type { Preview } from '@storybook/web-components';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview: Preview = {
  parameters: {
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
