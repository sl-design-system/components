import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { InlineMessage, type InlineMessageVariant } from './inline-message';
interface Props extends Pick<InlineMessage, 'indismissible' | 'size' | 'variant'> {
  title: string;
  button: string;
  body: string | (() => TemplateResult);
}
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    variant: 'info';
  };
  argTypes: {
    body: {
      table: {
        disable: true;
      };
    };
    button: {
      table: {
        disable: true;
      };
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'inline-radio';
      options: InlineMessageVariant[];
    };
  };
  render: ({ body, indismissible, size, title, variant }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Details: Story;
export declare const Dynamic: Story;
export declare const Icon: Story;
export declare const Indismissible: Story;
export declare const Overflow: Story;
export declare const Sizes: Story;
export declare const MultipleBackgrounds: StoryObj;
export declare const All: StoryObj;
