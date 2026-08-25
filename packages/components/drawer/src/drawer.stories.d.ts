import '@sl-design-system/button/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
declare const _default: {
  title: string;
  args: {
    attachment: string;
    buttonSize: string;
  };
  argTypes: {
    attachment: {
      control: string;
      options: string[];
    };
    buttonSize: {
      control: string;
      options: string[];
    };
  };
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
};
export default _default;
export declare const API: StoryObj;
export declare const DisableClose: StoryObj;
export declare const CompleteHeader: StoryObj;
