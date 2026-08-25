import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/calendar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type DateField } from './date-field.js';
type Props = Pick<
  DateField,
  | 'disabled'
  | 'max'
  | 'min'
  | 'month'
  | 'placeholder'
  | 'readonly'
  | 'requireConfirmation'
  | 'required'
  | 'selectOnly'
  | 'showValid'
  | 'showWeekNumbers'
  | 'value'
> & {
  hint?: string | TemplateResult;
  label?: string;
  reportValidity?: boolean;
  slot?(): TemplateResult;
  width?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    label: string;
    readonly: false;
    requireConfirmation: false;
    required: false;
    selectOnly: false;
    showValid: true;
    showWeekNumbers: false;
    width: string;
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
    max: {
      control: 'date';
    };
    min: {
      control: 'date';
    };
    month: {
      control: 'date';
    };
    slot: {
      table: {
        disable: true;
      };
    };
    value: {
      control: 'date';
    };
  };
  render: ({
    disabled,
    hint,
    label,
    max,
    min,
    month,
    placeholder,
    readonly,
    reportValidity,
    requireConfirmation,
    required,
    selectOnly,
    showValid,
    showWeekNumbers,
    slot,
    value,
    width
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const ExplicitWidth: Story;
export declare const ExtraControls: Story;
export declare const MinMax: Story;
export declare const Placeholder: Story;
export declare const Readonly: Story;
export declare const Required: Story;
export declare const SelectOnly: Story;
export declare const ShowWeekNumbers: Story;
export declare const Value: Story;
export declare const CustomCalendar: Story;
export declare const All: Story;
