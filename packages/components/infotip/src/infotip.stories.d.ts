import { type ButtonSize } from '@sl-design-system/button';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-field/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
type Props = {
  content: string;
  size: ButtonSize;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    content: string;
    size: 'md';
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({ content, size }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const CustomIcon: Story;
export declare const RichContent: Story;
export declare const InContext: Story;
