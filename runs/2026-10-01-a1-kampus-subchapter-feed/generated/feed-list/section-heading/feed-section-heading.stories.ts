import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-feed-section-heading` globally (guarded). A
// `type`-only import here would be erased at transform time and the element would never be
// defined, so Storybook would render nothing.
import './feed-section-heading.js';
import { type FeedSectionHeading } from './feed-section-heading.js';

type Props = Pick<FeedSectionHeading, 'heading' | 'view' | 'actionsHidden'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Feed section heading',
  render: ({ heading, view, actionsHidden }) => html`
    <sl-feed-section-heading
      .heading=${heading}
      .view=${view}
      ?actions-hidden=${actionsHidden}
    ></sl-feed-section-heading>
  `,
  args: {
    heading: 'Teksti',
    view: 'list'
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
