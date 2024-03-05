import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { MessageDialog, type MessageDialogConfig } from './message-dialog.js';

type Props = MessageDialogConfig & { onClick(args: Props): Promise<unknown> };
type Story = StoryObj<Props>;

export default {
  title: 'Message dialog',
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

export const CustomButtons: Story = {
  args: {
    onClick: async ({ buttons, message, title }) => await MessageDialog.show({ buttons, message, title }),
    title: 'Custom buttons',
    message: 'This is a message with custom buttons. Are you sure you want to press any buttons?',
    buttons: [
      { text: 'No, run away!', value: 'NO' },
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
