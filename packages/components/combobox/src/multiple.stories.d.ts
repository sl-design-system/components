import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { type Combobox } from './combobox.js';
type Props = Pick<
  Combobox,
  | 'allowCustomValues'
  | 'autocomplete'
  | 'disabled'
  | 'filterResults'
  | 'groupSelected'
  | 'placeholder'
  | 'selectOnly'
  | 'value'
> & {
  hint?: string;
  label?: string;
  maxWidth?: string;
  options?: unknown[] | (() => TemplateResult);
  optionGroupPath?: string;
  optionLabelPath?: string;
  optionValuePath?: string;
  virtualList?: boolean;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    allowCustomValues: false;
    autocomplete: 'both';
    disabled: false;
    filterResults: false;
    label: string;
    hint: string;
    maxWidth: string;
    placeholder: string;
    selectOnly: false;
    virtualList: false;
  };
  argTypes: {
    autocomplete: {
      control: 'inline-radio';
      options: string[];
    };
    options: {
      table: {
        disable: true;
      };
    };
  };
  render: ({
    allowCustomValues,
    autocomplete,
    disabled,
    filterResults,
    groupSelected,
    hint,
    label,
    maxWidth,
    optionGroupPath,
    optionLabelPath,
    optionValuePath,
    options,
    placeholder,
    selectOnly,
    value,
    virtualList
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const AllowCustomValues: Story;
export declare const Disabled: Story;
export declare const FilterResults: Story;
export declare const GroupSelected: Story;
export declare const Groups: Story;
export declare const GroupsWithGroupSelected: Story;
export declare const RichContent: Story;
export declare const SelectOnly: Story;
export declare const Selected: Story;
export declare const Stacked: Story;
export declare const Value: Story;
export declare const VirtualList: Story;
export declare const VirtualListWithGroups: Story;
