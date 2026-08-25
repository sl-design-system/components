import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Tag } from './tag.js';
type Props = Pick<Tag, 'disabled' | 'label' | 'removable' | 'size' | 'variant'> & {
  maxWidth?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    a11y: {
      config: {
        rules: {
          id: string;
          selector: string;
        }[];
      };
    };
  };
  args: {
    disabled: false;
    label: string;
    removable: false;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    disabled,
    label,
    maxWidth,
    removable,
    size,
    variant
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Info: Story;
export declare const Overflow: Story;
export declare const OverflowRemovable: Story;
export declare const Removable: Story;
export declare const InfoRemovable: Story;
export declare const RemovableDisabled: Story;
