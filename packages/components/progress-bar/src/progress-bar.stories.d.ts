import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type ProgressBar } from './progress-bar.js';
type Props = Pick<ProgressBar, 'indeterminate' | 'label' | 'variant' | 'value'> & {
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    label: string;
    value: number;
    indeterminate: false;
    variant: undefined;
  };
  argTypes: {
    value: {
      control: {
        type: 'range';
        min: number;
        max: number;
      };
    };
    variant: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    slot: {
      table: {
        disable: true;
      };
    };
  };
  render: ({ indeterminate, variant, value, label, slot }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Overflow: Story;
export declare const Indeterminate: Story;
export declare const Download: StoryObj;
export declare const Colors: StoryObj;
export declare const All: StoryObj;
