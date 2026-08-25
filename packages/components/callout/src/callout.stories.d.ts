import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { Callout, type CalloutVariant } from './callout.js';
interface Props extends Pick<Callout, 'density' | 'variant'> {
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
    density: {
      control: 'inline-radio';
      options: string[];
    };
    variant: {
      control: 'inline-radio';
      options: CalloutVariant[];
    };
  };
  render: ({ body, density, title, variant }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Title: Story;
export declare const CustomIcon: Story;
export declare const Overflow: Story;
export declare const Density: Story;
export declare const WithActions: Story;
export declare const MultipleBackgrounds: StoryObj;
export declare const All: StoryObj;
