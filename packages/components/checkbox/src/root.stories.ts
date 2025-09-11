import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Form/Checkbox',
  tags: ['stable']
} as Meta;

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: auto repeat(1fr, 9);
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="grid-column: 2 / 5; justify-self: center">sm</span>
        <span style="grid-column: 5 / 8; justify-self: center">md</span>
        <span style="grid-column: 8 / 11; justify-self: center">lg</span>

        <span>Default</span>
        <sl-checkbox size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox>Unchecked</sl-checkbox>
        <sl-checkbox checked>Checked</sl-checkbox>
        <sl-checkbox indeterminate>Indeterminate</sl-checkbox>
        <sl-checkbox size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate size="lg">Indeterminate</sl-checkbox>

        <span>Invalid</span>
        <sl-checkbox show-validity="invalid" size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid" size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid" size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="invalid">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="invalid" size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid" size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid" size="lg">Indeterminate</sl-checkbox>

        <span>Valid</span>
        <sl-checkbox show-validity="valid" size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid" size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid" size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="valid">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="valid" size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid" size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid" size="lg">Indeterminate</sl-checkbox>

        <span>Disabled</span>
        <sl-checkbox disabled size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked disabled size="sm">Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox disabled>Unchecked</sl-checkbox>
        <sl-checkbox checked disabled>Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate>Indeterminate</sl-checkbox>
        <sl-checkbox disabled size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked disabled size="lg">Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate size="lg">Indeterminate</sl-checkbox>
      </div>
    `;
  }
};
