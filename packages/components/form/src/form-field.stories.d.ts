import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/infotip/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/number-field/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type FormField } from './form-field.js';
type Props = Pick<FormField, 'hint' | 'label'> & {
  customValidity?: string;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    hint: string;
    label: string;
  };
  argTypes: {
    slot: {
      table: {
        disable: true;
      };
    };
  };
  render: ({ customValidity, hint, label, slot }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Checkbox: Story;
export declare const CheckboxGroup: Story;
export declare const Combobox: Story;
export declare const DateField: Story;
export declare const NumberField: Story;
export declare const RadioGroup: Story;
export declare const Select: Story;
export declare const Switch: Story;
export declare const TextArea: Story;
export declare const TextField: Story;
export declare const Composite: Story;
export declare const CustomError: Story;
export declare const CustomHint: Story;
export declare const CustomLabel: Story;
