import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-nsp-top-nav` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './top-nav.js';
import { type TopNav } from './top-nav.js';

type Props = Pick<TopNav, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/B NSP Home/Top nav',
  render: () => html`<sl-nsp-top-nav></sl-nsp-top-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};
