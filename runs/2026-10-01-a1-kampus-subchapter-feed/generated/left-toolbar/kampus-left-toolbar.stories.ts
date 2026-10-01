import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-a1-kampus-left-toolbar` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './kampus-left-toolbar.js';
import { type A1KampusLeftToolbar } from './kampus-left-toolbar.js';

type Props = Pick<A1KampusLeftToolbar, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Left toolbar',
  render: () => html`
    <div style="block-size: 664px;">
      <sl-a1-kampus-left-toolbar
        .model=${{
          activeToolId: 'contents',
          badges: { 'edit-content': 4, assignments: 1 }
        }}
      ></sl-a1-kampus-left-toolbar>
    </div>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
