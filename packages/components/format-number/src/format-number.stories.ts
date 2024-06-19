import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type FormatNumber } from './format-number.js';

type Props = Pick<FormatNumber, 'locale' | 'number'>;
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format number',
  tags: ['draft'],
  render: ({ locale, number }) =>
    html`<sl-format-number .number=${number} locale=${ifDefined(locale)}></sl-format-number>`
} satisfies Meta<Props>;

export const Basic: Story = {};
