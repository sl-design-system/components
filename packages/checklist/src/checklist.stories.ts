import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';

type Story = StoryObj;

export default {
  title: 'Checklist',
  parameters: {
    layout: 'centered'
  },
  render: () => html`<slds-checklist></slds-checklist>`
} satisfies Meta;

export const Basic: Story = {};
