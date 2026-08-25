import '@sl-design-system/badge/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Avatar, type AvatarColor, type AvatarSize } from './avatar.js';
type Props = Pick<
  Avatar,
  | 'color'
  | 'displayInitials'
  | 'displayName'
  | 'emphasis'
  | 'href'
  | 'imageOnly'
  | 'pictureUrl'
  | 'shape'
  | 'size'
  | 'vertical'
> & {
  badge?(): TemplateResult;
  fallback?(): TemplateResult;
  maxWidth?: string;
  subheading?: string;
  tabIndex?: number;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    displayName: string;
    imageOnly: false;
    pictureUrl: string;
    size: 'md';
    subheading: string;
    vertical: false;
  };
  argTypes: {
    badge: {
      table: {
        disable: true;
      };
    };
    color: {
      control: 'radio';
      options: AvatarColor[];
    };
    emphasis: {
      control: 'inline-radio';
      options: string[];
    };
    fallback: {
      table: {
        disable: true;
      };
    };
    href: {
      control: 'text';
    };
    shape: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: AvatarSize[];
    };
  };
  render: ({
    badge,
    color,
    displayInitials,
    displayName,
    emphasis,
    fallback,
    href,
    imageOnly,
    maxWidth,
    pictureUrl,
    shape,
    size,
    subheading,
    tabIndex,
    vertical
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Colors: Story;
export declare const FallbackContent: Story;
export declare const Href: Story;
export declare const ImageOnlyWithFocus: Story;
export declare const ImplicitInitials: Story;
export declare const CustomInitials: Story;
export declare const Overflow: Story;
export declare const Sizes: Story;
export declare const Square: Story;
export declare const Vertical: Story;
