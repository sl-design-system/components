import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type TabGroup } from './tab-group.js';
type Props = Pick<TabGroup, 'activation' | 'alignTabs' | 'vertical'> & {
  tabs?(): TemplateResult;
  tabPanels?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    vertical: false;
  };
  argTypes: {
    activation: {
      control: 'inline-radio';
      options: string[];
    };
    alignTabs: {
      control: 'inline-radio';
      options: string[];
    };
    tabs: {
      table: {
        disable: true;
      };
    };
    tabPanels: {
      table: {
        disable: true;
      };
    };
  };
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  render: ({ activation, alignTabs, tabs, tabPanels, vertical }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const AutoActivation: Story;
export declare const IconOnly: Story;
export declare const InitialSelected: Story;
export declare const Lazy: Story;
export declare const Links: Story;
export declare const NoPanels: Story;
export declare const OverflowHorizontal: Story;
export declare const OverflowVertical: Story;
export declare const Responsive: Story;
export declare const Selected: Story;
export declare const Sticky: Story;
export declare const Subtitle: Story;
export declare const Vertical: Story;
export declare const All: Story;
