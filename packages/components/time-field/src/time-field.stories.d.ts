import '@sl-design-system/button/register.js';
import '@sl-design-system/form/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type TimeField } from './time-field.js';
type Props = Pick<
  TimeField,
  | 'disabled'
  | 'hourStep'
  | 'locale'
  | 'max'
  | 'min'
  | 'minuteStep'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'start'
  | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
  width?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    label: string;
    readonly: false;
    required: false;
    value: string;
  };
  argTypes: {
    hint: {
      table: {
        disable: true;
      };
    };
    label: {
      table: {
        disable: true;
      };
    };
    locale: {
      control: 'inline-radio';
      options: string[];
    };
    reportValidity: {
      table: {
        disable: true;
      };
    };
  };
  render: ({
    disabled,
    hint,
    hourStep,
    label,
    locale,
    max,
    min,
    minuteStep,
    placeholder,
    readonly,
    reportValidity,
    required,
    start,
    value,
    width
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Placeholder: Story;
export declare const Finnish: Story;
export declare const MinMax: Story;
export declare const Readonly: Story;
export declare const Required: Story;
export declare const ExplicitWidth: Story;
export declare const Start: Story;
export declare const Steps: Story;
export declare const Value: Story;
