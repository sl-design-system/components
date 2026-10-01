import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { SUBCHAPTER_FEED_PAGE_DATA } from '../mock-data.js';
// Plain side-effect import so `sl-subchapter-feed-header` actually registers - a type-only
// import would be erased at transform time and the element would never be defined.
import './subchapter-feed-header.js';
import { type SubchapterFeedHeader } from './subchapter-feed-header.js';

type Props = Pick<SubchapterFeedHeader, 'model' | 'selectedFilter' | 'studentView'>;
type Story = StoryObj<Props>;

// In the real page this would come from `sl-subchapter-feed-page`, which owns the fetch for the
// whole subchapter feed; this story exercises the header standalone with its slice of that data.
const model = SUBCHAPTER_FEED_PAGE_DATA.header;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Feed header',
  args: { model, selectedFilter: 'all', studentView: false },
  render: ({ model, selectedFilter, studentView }) => html`
    <sl-subchapter-feed-header
      .model=${model}
      .selectedFilter=${selectedFilter}
      ?studentView=${studentView}>
    </sl-subchapter-feed-header>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
