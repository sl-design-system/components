import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Breadcrumbs } from './breadcrumbs.js';
type Props = Pick<Breadcrumbs, 'hideHomeLabel' | 'inverted' | 'homeUrl' | 'noHome'> & {
  breadcrumbs(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    viewport: {
      disable: boolean;
    };
  };
  args: {
    hideHomeLabel: false;
    inverted: false;
    homeUrl: string;
    noHome: false;
  };
  argTypes: {
    breadcrumbs: {
      table: {
        disable: true;
      };
    };
  };
  render: ({ breadcrumbs, hideHomeLabel, inverted, homeUrl, noHome }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Collapse: Story;
export declare const HomeUrl: Story;
export declare const Inverted: Story;
export declare const Mobile: Story;
export declare const NoHome: Story;
export declare const HideHomeLabel: Story;
export declare const CustomHome: Story;
export declare const Overflow: Story;
export declare const CustomStyledLinks: Story;
export declare const All: Story;
