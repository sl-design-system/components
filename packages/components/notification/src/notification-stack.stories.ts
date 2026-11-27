import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { type NotificationStack } from './notification-stack.js';
import { NotificationStore } from './notification-store.js';
import { add, renderAppHeader, renderControls, styles } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationStack, 'maxVisible' | 'position'>;
type Story = StoryObj<Props>;

/** A store of its own, so these notifications don't show up in the other stories. */
const store = new NotificationStore();

const renderStack = ({ maxVisible, position }: Props): TemplateResult => html`
  ${styles} ${renderAppHeader(store)} ${renderControls(store)}
  <p>
    Send several: they pile up with the newest in front; hover, Tab in or click the edges to expand.
    Errors and notifications with an action are never piled. Press F8 to jump to the newest
    notification, ↓ ↑ to move between them and Esc to close one. Open the dialog to see the stack
    stay above it.
  </p>
  <sl-notification-stack
    .maxVisible=${maxVisible}
    .position=${position}
    .store=${store}></sl-notification-stack>
`;

export default {
  title: 'Feedback & status/Notification/Notification stack',
  args: {
    maxVisible: 5,
    position: 'bottom-end'
  },
  argTypes: {
    maxVisible: {
      control: { type: 'number', min: 1, max: 10 }
    },
    position: {
      control: 'select',
      options: ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end']
    }
  },
  render: args => renderStack(args)
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Pile: Story = {
  render: args => {
    if (!store.active.length) {
      ['info', 'success', 'info', 'success'].forEach(variant =>
        add(variant as 'info' | 'success', store)
      );
    }

    return renderStack(args);
  }
};
