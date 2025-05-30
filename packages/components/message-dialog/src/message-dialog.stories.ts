import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { MessageDialog, type MessageDialogButton, type MessageDialogConfig } from './message-dialog.js';

type Props = {
  buttons: MessageDialogButton[];
  disableCancel?: boolean;
  onClick(args: Props): Promise<unknown>;
  message(): string | TemplateResult;
  title: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Message dialog',
  tags: ['preview'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true },
    viewport: {
      defaultViewport: 'reset'
    }
  },
  render: args => html`<sl-button @click=${() => args.onClick(args)}>Show message</sl-button>`
} satisfies Meta<Props>;

export const Alert: Story = {
  args: {
    onClick: async ({ message, title }) => await MessageDialog.alert(message() as string, title),
    message: () =>
      'This is an alert message. Use this to alert the user about something. This is the design system equivalent of calling window.alert().'
  }
};

export const Confirm: Story = {
  args: {
    onClick: async ({ message, title }) => {
      const result = await MessageDialog.confirm(message() as string, title);

      void MessageDialog.alert(`The result was: ${result}`);
    },
    message: () =>
      'This is a confirmation message. The message dialog contains a "Cancel" and "OK" button by default. You can customize this using the buttons property.'
  }
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  },
  args: {
    onClick: async ({ buttons, message, title }): Promise<void> => {
      await MessageDialog.show({ buttons, message: message(), title });
    },
    title: 'Allow SLDS?',
    message: () => 'The SL Design System is an amazing tool that will make your app look so much better.',
    buttons: [
      { text: "Don't allow", fill: 'outline', value: false, variant: 'primary' },
      { text: 'Allow', value: true, variant: 'primary' }
    ]
  }
};

export const CustomButtons: Story = {
  args: {
    buttons: [
      { text: 'No, run away!', fill: 'outline', value: 'NO', variant: 'primary' },
      { text: "Yes, I don't care what it does", value: 'YES', variant: 'danger' }
    ],
    disableCancel: true,
    onClick: async args => {
      await MessageDialog.show({ ...args, message: args.message() });
    },
    title: 'Custom buttons',
    message: () => 'This is a message with custom buttons. Are you sure you want to press any buttons?'
  }
};

export const CustomMessage: Story = {
  args: {
    disableCancel: true,
    onClick: async args => {
      const params: MessageDialogConfig = {
        ...args,
        buttons: [{ text: 'OK', variant: 'primary' }],
        message: args.message()
      };

      await MessageDialog.show(params);
    },
    title: 'Custom message',
    message: () => html`You can <em>customize</em> the message with <strong>HTML</strong>!`
  }
};

export const All: Story = {
  parameters: { chromatic: { delay: 300 } },
  render: () => {
    setTimeout(() => {
      void MessageDialog.alert('Alert dialog content');
    });

    return html`Dialog should have opened by now`;
  }
};
