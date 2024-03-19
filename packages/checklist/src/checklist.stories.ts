import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../index.js';

type Story = StoryObj;

export default {
  title: 'Checklist',
  render: () => html`<slds-checklist></slds-checklist>`
} satisfies Meta;

export const Basic: Story = {};
