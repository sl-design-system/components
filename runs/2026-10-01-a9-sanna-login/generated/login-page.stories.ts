import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
// Importing the component registers `sl-login-page` globally (guarded) as a side effect.
import { type LoginPage } from './login-page.js';

type Props = Pick<LoginPage, 'loading' | 'locationsEndpoint' | 'selectedLocationId'>;
type Story = StoryObj<Props>;

export default {
  title: 'Examples/Login page',
  parameters: { layout: 'fullscreen' },
  args: {
    loading: false,
    locationsEndpoint: '/api/locations',
    selectedLocationId: 'belgium'
  },
  render: ({ loading, locationsEndpoint, selectedLocationId }) => html`
    <sl-login-page
      ?loading=${loading}
      locations-endpoint=${ifDefined(locationsEndpoint)}
      selected-location-id=${ifDefined(selectedLocationId ?? undefined)}
    ></sl-login-page>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
