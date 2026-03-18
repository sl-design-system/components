import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import { setup } from '@sl-design-system/sanoma-learning';
import { type Preview } from '@storybook/web-components-vite';

setup();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
};

export default preview;
