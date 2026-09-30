import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — a type-only import would be erased at transform time and the
// element would never register. This registers `sl-nsp-placeholder-block` globally (guarded).
import './placeholder-block.js';

type Story = StoryObj;

export default {
  title: 'Runs/B NSP Home/Placeholder block',
  render: () => html`<sl-nsp-placeholder-block></sl-nsp-placeholder-block>`
} satisfies Meta;

export const Basic: Story = {};
