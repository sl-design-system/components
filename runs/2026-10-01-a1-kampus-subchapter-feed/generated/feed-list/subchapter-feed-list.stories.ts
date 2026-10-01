import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { SUBCHAPTER_FEED_PAGE_DATA } from '../mock-data.js';
// Plain side-effect import so `sl-subchapter-feed-list` actually registers - a type-only import
// would be erased at transform time and the element would never be defined.
import './subchapter-feed-list.js';
import { type SubchapterFeedList } from './subchapter-feed-list.js';

type Props = Pick<SubchapterFeedList, 'model' | 'studentView'>;
type Story = StoryObj<Props>;

// In the real page this would come from `sl-subchapter-feed-page`, which owns the fetch for the
// whole subchapter feed; this story exercises the list standalone with its slice of that data,
// rendering all four sections of the design.
const model = SUBCHAPTER_FEED_PAGE_DATA.feed;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Feed list',
  args: { model, studentView: false },
  render: ({ model, studentView }) => html`
    <sl-subchapter-feed-list .model=${model} ?student-view=${studentView}></sl-subchapter-feed-list>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
