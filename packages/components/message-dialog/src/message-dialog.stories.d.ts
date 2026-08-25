import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type MessageDialogButton } from './message-dialog.js';
type Props = {
  buttons: MessageDialogButton[];
  disableCancel?: boolean;
  onClick(args: Props): Promise<unknown>;
  message(): string | TemplateResult;
  title: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    viewport: {
      disable: boolean;
    };
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  render: (args: Props) => TemplateResult<1>;
};
export default _default;
export declare const Alert: Story;
export declare const Confirm: Story;
export declare const Mobile: Story;
export declare const CustomButtons: Story;
export declare const CustomMessage: Story;
export declare const All: Story;
