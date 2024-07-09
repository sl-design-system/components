import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { MessageDialog, type MessageDialogConfig } from './message-dialog.js';

type Props = MessageDialogConfig & { onClick(args: Props): Promise<unknown> };
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Message dialog',
  tags: ['preview'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: args => {
    const onClick = async (): Promise<void> => {
      const result = await args.onClick(args);

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      void MessageDialog.alert(`The result was: ${result}`);
    };

    return html`<sl-button @click=${onClick}>Show message</sl-button>`;
  }
} satisfies Meta<Props>;

export const Alert: Story = {
  args: {
    onClick: async ({ message, title }) => await MessageDialog.alert(message as string, title),
    message: 'This is an alert message.'
  }
};

export const Confirm: Story = {
  args: {
    onClick: async ({ message, title }) => await MessageDialog.confirm(message as string, title),
    message: 'This is a confirmation message.'
  }
};

export const Mobile: Story = {
  args: {
    onClick: async ({ buttons, message, title }) => await MessageDialog.show({ buttons, message, title }),
    title: 'Allow "SLDS" to make your application look sooooo much better?',
    message: 'The SL Design System is an amazing tool that will make your app look so much better.',
    buttons: [
      { text: "Don't allow", fill: 'outline', value: false, variant: 'primary' },
      { text: 'Allow', value: true, variant: 'primary' }
    ]
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone13'
    }
  }
};

export const CustomButtons: Story = {
  args: {
    onClick: async ({ buttons, message, title }) => await MessageDialog.show({ buttons, message, title }),
    title: 'Custom buttons',
    message:
      'This is a message with custom buttons. Are you sure you want to press any buttons?. Mollit tempor reprehenderit non ad do. Minim enim enim officia fugiat nisi officia eiusmod amet minim cupidatat irure laborum nulla. Dolore anim consectetur culpa ex officia aliqua non minim. Veniam sunt minim anim occaecat labore excepteur duis elit irure sunt. Veniam amet quis amet consectetur non ea commodo dolore.',
    buttons: [
      { text: 'No, run away!', fill: 'outline', value: 'NO', variant: 'primary' },
      { text: "Yes, I don't care what it does", value: 'YES', variant: 'danger' }
    ]
  }
};

export const CustomMessage: Story = {
  args: {
    onClick: async ({ message, title }) =>
      await MessageDialog.show({ message, title, buttons: [{ text: 'OK', variant: 'primary' }] }),
    title: 'Custom message',
    message: html`You can <em>customize</em> the message with <strong>HTML</strong>!`
  }
};

export const All: Story = {
  parameters: { chromatic: { delay: 300 } },
  render: () => {
    setTimeout(() => {
      void MessageDialog.alert('Alert dialog content');
    });

    return html`Dialog should have openend by now`;
  }
};
