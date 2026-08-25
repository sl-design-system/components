import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Badge, type BadgeColor, type BadgeVariant } from './badge.js';
type Props = Pick<Badge, 'color' | 'emphasis' | 'size' | 'variant'> & {
  icon?: boolean;
  text?: string;
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
    emphasis: 'subtle';
    icon: false;
    size: 'lg';
    text: string;
  };
  argTypes: {
    color: {
      control: 'radio';
      options: BadgeColor[];
    };
    emphasis: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'radio';
      options: BadgeVariant[];
    };
  };
  render: ({
    color,
    emphasis,
    icon,
    size,
    text,
    variant
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Round: Story;
export declare const Variant: Story;
export declare const All: Story;
