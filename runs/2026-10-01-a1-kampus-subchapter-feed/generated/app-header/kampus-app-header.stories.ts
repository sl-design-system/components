import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-kampus-app-header` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './kampus-app-header.js';
import { type KampusAppHeader } from './kampus-app-header.js';

type Props = Pick<KampusAppHeader, 'activeNavId' | 'notificationCount'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/App header',
  parameters: { layout: 'fullscreen' },
  args: {
    activeNavId: 'learning-materials',
    notificationCount: 3
  },
  render: ({ activeNavId, notificationCount }) => html`
    <sl-kampus-app-header
      active-nav-id=${activeNavId}
      .notificationCount=${notificationCount}
    ></sl-kampus-app-header>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
