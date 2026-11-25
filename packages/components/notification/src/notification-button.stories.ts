import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type NotificationButton } from './notification-button.js';
import { createStore, styles } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationButton, 'maxCount'> & { unread: number };
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Notification/Notification button',
  args: {
    maxCount: 99,
    unread: 3
  },
  argTypes: {
    unread: {
      control: { type: 'number', min: 0, max: 150 }
    }
  },
  render: ({ maxCount, unread }) => html`
    <sl-notification-button
      .maxCount=${maxCount}
      .store=${createStore({ unread })}></sl-notification-button>
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

export const InHeader: Story = {
  render: () => {
    const store = createStore({ unread: 3, read: 4 });

    return html`
      ${styles}
      <header class="app-header">
        <strong>Lesplanner</strong>
        <sl-notification-button .store=${store} manager="button-inbox"></sl-notification-button>
      </header>
      <sl-notification-manager .store=${store} id="button-inbox"></sl-notification-manager>
    `;
  }
};
