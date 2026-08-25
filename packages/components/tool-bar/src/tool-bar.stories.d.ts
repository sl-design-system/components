import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type ToolBar } from './tool-bar.js';
interface Props extends Pick<ToolBar, 'align' | 'contained' | 'disabled' | 'inverted' | 'fill'> {
  description?: string | TemplateResult;
  itemsOutsideContainer?(args: Props): TemplateResult;
  items?(args: Props): TemplateResult;
  resizable?: boolean;
  width?: string;
  enableLogging?: boolean;
}
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    resizable: true;
    enableLogging: false;
  };
  argTypes: {
    align: {
      control: 'inline-radio';
      options: string[];
    };
    contained: {
      control: 'boolean';
    };
    description: {
      table: {
        disable: true;
      };
    };
    disabled: {
      control: 'boolean';
    };
    inverted: {
      control: 'boolean';
    };
    items: {
      table: {
        disable: true;
      };
    };
    itemsOutsideContainer: {
      table: {
        disable: true;
      };
    };
    resizable: {
      control: 'boolean';
    };
    fill: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: (args: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Contained: Story;
export declare const AlignEnd: Story;
export declare const Disabled: Story;
export declare const Empty: Story;
export declare const FitContent: Story;
export declare const NestedContent: Story;
export declare const Inverted: Story;
export declare const InvertedContained: Story;
export declare const ClickEvents: Story;
export declare const Overflow: Story;
export declare const State: Story;
export declare const Tooltips: Story;
export declare const Combination: Story;
export declare const MixedVariantsAndFills: Story;
export declare const Examples: Story;
export declare const All: Story;
