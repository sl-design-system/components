import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { TextField } from './text-field.js';
type Props = Pick<
  TextField,
  | 'disabled'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'showValid'
  | 'size'
  | 'type'
  | 'value'
> & {
  hint?: string;
  label?: string;
  control?(): TemplateResult;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    label: string;
    placeholder: string;
    readonly: false;
    required: false;
    showValid: false;
  };
  argTypes: {
    maxLength: {
      type: 'number';
    };
    minLength: {
      type: 'number';
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
    type: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    control,
    disabled,
    hint,
    label,
    maxLength,
    minLength,
    pattern,
    placeholder,
    readonly,
    required,
    showValid,
    size,
    slot,
    type,
    value
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const MinMaxLength: Story;
export declare const Pattern: Story;
export declare const PrefixSuffix: Story;
export declare const Readonly: Story;
export declare const Required: Story;
export declare const Valid: Story;
export declare const CustomInput: Story;
export declare const CustomValidity: Story;
export declare const CustomAsyncValidity: Story;
export declare const All: Story;
