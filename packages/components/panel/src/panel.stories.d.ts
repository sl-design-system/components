import '@sl-design-system/avatar/register.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Panel, type PanelDensity, PanelElevation, type TogglePlacement } from './panel.js';
type Props = Pick<
  Panel,
  | 'collapsed'
  | 'collapsible'
  | 'density'
  | 'divider'
  | 'elevation'
  | 'heading'
  | 'noBorder'
  | 'togglePlacement'
> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
  prefix?(): string | TemplateResult;
  suffix?(): string | TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    collapsible: false;
    density: 'default';
    divider: false;
    elevation: 'none';
    noBorder: false;
    togglePlacement: 'start';
  };
  argTypes: {
    actions: {
      table: {
        disable: true;
      };
    };
    collapsed: {
      control: 'boolean';
    };
    content: {
      table: {
        disable: true;
      };
    };
    density: {
      control: 'radio';
      options: PanelDensity[];
    };
    elevation: {
      control: 'radio';
      options: PanelElevation[];
    };
    prefix: {
      table: {
        disable: true;
      };
    };
    suffix: {
      table: {
        disable: true;
      };
    };
    togglePlacement: {
      control: 'radio';
      options: TogglePlacement[];
    };
  };
  render: ({
    actions,
    collapsed,
    collapsible,
    content,
    density,
    divider,
    elevation,
    heading,
    noBorder,
    prefix,
    suffix,
    togglePlacement
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const WithPrefix: Story;
export declare const WithSuffix: Story;
export declare const Collapsible: Story;
export declare const Collapsed: Story;
export declare const OverflowHeading: Story;
export declare const OverflowActions: Story;
export declare const FixedInlineSize: Story;
export declare const WithoutActions: Story;
export declare const NoPaddingContent: Story;
export declare const NoHeader: Story;
export declare const ToggleExternally: Story;
export declare const All: Story;
