import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type ToggleGroup } from './toggle-group.js';
type Props = Pick<ToggleGroup, 'disabled' | 'fill' | 'multiple' | 'shape' | 'size'> & {
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    multiple: false;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
    fill: {
      control: 'inline-radio';
      options: string[];
    };
    shape: {
      control: 'inline-radio';
      options: string[];
    };
    slot: {
      table: {
        disable: true;
      };
    };
  };
  render: ({ disabled, fill, multiple, shape, size, slot }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Multiple: Story;
export declare const Text: Story;
export declare const TextWithIcons: Story;
export declare const AllFunctionalVariants: Story;
export declare const All: Story;
