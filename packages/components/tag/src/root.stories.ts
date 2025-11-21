import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Feedback & status/Tag',
  tags: ['preview']
} as Meta;

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          grid-template-columns: auto 1fr 1fr 1fr 1fr;
          gap: 1rem;
          justify-items: center;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center; grid-column: 2 / 4">md</span>
        <span style="justify-self: center; grid-column: 4 / 6">lg</span>

        <span></span>
        <span>default</span>
        <span>info</span>
        <span>default</span>
        <span>info</span>

        <span>Default</span>
        <sl-tag>Label</sl-tag>
        <sl-tag variant="info">Label</sl-tag>
        <sl-tag size="lg">Label</sl-tag>
        <sl-tag size="lg" variant="info">Label</sl-tag>

        <span>Overflow</span>
        <sl-tag style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag style="max-inline-size: 100px" variant="info">Overflow label</sl-tag>
        <sl-tag size="lg" style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag size="lg" style="max-inline-size: 100px" variant="info">Overflow label</sl-tag>

        <span>Removable</span>
        <sl-tag removable>Removable</sl-tag>
        <sl-tag removable variant="info">Removable</sl-tag>
        <sl-tag removable size="lg">Removable</sl-tag>
        <sl-tag removable size="lg" variant="info">Removable</sl-tag>

        <span>Disabled</span>
        <sl-tag disabled>Disabled</sl-tag>
        <sl-tag disabled variant="info">Disabled</sl-tag>
        <sl-tag size="lg" disabled>Disabled</sl-tag>
        <sl-tag size="lg" disabled variant="info">Disabled</sl-tag>
      </div>
    `;
  }
};
