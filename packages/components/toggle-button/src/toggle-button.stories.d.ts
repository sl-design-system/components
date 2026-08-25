import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';
type Props = Pick<ToggleButton, 'disabled' | 'fill' | 'pressed' | 'shape' | 'size' | 'tooltip'> & {
  icons(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    pressed: false;
    tooltip: string;
  };
  argTypes: {
    fill: {
      control: 'inline-radio';
      options: string[];
    };
    icons: {
      table: {
        disable: true;
      };
    };
    shape: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({ disabled, fill, icons, pressed, shape, size, tooltip }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Outline: Story;
export declare const Pressed: Story;
export declare const Errors: Story;
export declare const All: Story;
