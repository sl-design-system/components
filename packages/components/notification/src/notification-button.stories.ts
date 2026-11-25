import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type NotificationButton } from './notification-button.js';
import { createStore } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationButton, 'drawerBelow' | 'fullscreenBelow' | 'maxCount'> & {
  read: number;
  unread: number;
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Notification/Notification button',
  args: {
    drawerBelow: 1024,
    fullscreenBelow: 600,
    maxCount: 99,
    read: 14,
    unread: 3
  },
  argTypes: {
    read: {
      control: { type: 'number', min: 0, max: 50 }
    },
    unread: {
      control: { type: 'number', min: 0, max: 150 }
    }
  },
  render: ({ drawerBelow, fullscreenBelow, maxCount, read, unread }) => html`
    <sl-notification-button
      .drawerBelow=${drawerBelow}
      .fullscreenBelow=${fullscreenBelow}
      .maxCount=${maxCount}
      .store=${createStore({ read, unread })}></sl-notification-button>
    <p>
      Use the button to open the manager: a popover, a drawer or full screen, depending on the width
      of the viewport and the drawerBelow and fullscreenBelow controls.
    </p>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const States: Story = {
  render: () => html`
    <style>
      .states {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, 8rem);
        justify-items: center;
      }
    </style>
    <div class="states">
      <sl-notification-button .store=${createStore()}></sl-notification-button>
      <sl-notification-button .store=${createStore({ unread: 3 })}></sl-notification-button>
      <sl-notification-button .store=${createStore({ unread: 120 })}></sl-notification-button>
      <span>No unread</span>
      <span>Unread</span>
      <span>Overflow</span>
    </div>
  `
};

export const Popover: Story = {
  args: {
    drawerBelow: 0,
    fullscreenBelow: 0
  }
};

export const Drawer: Story = {
  args: {
    drawerBelow: 10000
  }
};

export const FullScreen: Story = {
  args: {
    fullscreenBelow: 10000
  }
};
