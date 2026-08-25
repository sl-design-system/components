import '@sl-design-system/form/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type TextArea } from './text-area.js';
type Props = Pick<
  TextArea,
  | 'disabled'
  | 'maxLength'
  | 'minLength'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'rows'
  | 'showCount'
  | 'showValid'
  | 'size'
  | 'resize'
  | 'value'
  | 'wrap'
> & {
  hint?: string;
  label?: string;
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
    resize: 'vertical';
    showValid: false;
    size: 'md';
    value: string;
    wrap: 'soft';
  };
  argTypes: {
    resize: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
    value: {
      control: 'text';
    };
    wrap: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    disabled,
    label,
    hint,
    maxLength,
    minLength,
    placeholder,
    required,
    showCount,
    showValid,
    size,
    resize,
    readonly,
    rows,
    slot,
    value,
    wrap
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const MinMaxLength: Story;
export declare const Readonly: Story;
export declare const Required: Story;
export declare const Resize: Story;
export declare const Rows: Story;
export declare const Valid: Story;
export declare const ShowCount: Story;
export declare const CustomValidity: StoryObj;
export declare const CustomAsyncValidity: Story;
export declare const All: Story;
