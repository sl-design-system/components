import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { SUBCHAPTER_FEED_PAGE_DATA } from '../mock-data.js';
// Plain side-effect import — registers `sl-kampus-toc-sidebar` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './kampus-toc-sidebar.js';
import { type KampusTocSidebar } from './kampus-toc-sidebar.js';

type Props = Pick<KampusTocSidebar, 'model' | 'selectedId'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/ToC sidebar',
  args: {
    model: SUBCHAPTER_FEED_PAGE_DATA.toc,
    selectedId: 'subchapter-1'
  },
  render: ({ model, selectedId }) => html`
    <sl-kampus-toc-sidebar .model=${model} selected-id=${selectedId}></sl-kampus-toc-sidebar>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
