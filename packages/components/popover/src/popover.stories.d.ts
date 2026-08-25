import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Popover } from './popover.js';
type Props = Pick<Popover, 'position'> & {
  alignSelf: string;
  body: string | (() => TemplateResult);
  maxWidth: number;
  noDescribedby: boolean;
  justifySelf: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    alignSelf: string;
    body: string;
    justifySelf: string;
    position: 'bottom';
  };
  argTypes: {
    alignSelf: {
      control: 'inline-radio';
      options: string[];
    };
    body: {
      table: {
        disable: true;
      };
    };
    maxWidth: {
      control: 'number';
    };
    justifySelf: {
      control: 'inline-radio';
      options: string[];
    };
    position: {
      control: 'select';
      options: string[];
    };
  };
  render: ({
    alignSelf,
    justifySelf,
    body,
    maxWidth,
    position,
    noDescribedby
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const NoDescribedBy: Story;
export declare const VerticalOverflow: Story;
export declare const RichContent: Story;
export declare const WithTooltips: Story;
export declare const All: Story;
