import '@sl-design-system/form/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type NumberField } from './number-field.js';
type Props = Pick<
  NumberField,
  | 'stepButtons'
  | 'disabled'
  | 'formatOptions'
  | 'inputSize'
  | 'locale'
  | 'max'
  | 'min'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'size'
  | 'step'
  | 'valueAsNumber'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    inputSize: number;
    label: string;
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
    size: {
      control: 'inline-radio';
      options: string[];
    };
    stepButtons: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    disabled,
    formatOptions,
    label,
    hint,
    inputSize,
    locale,
    max,
    min,
    placeholder,
    readonly,
    reportValidity,
    required,
    size,
    step,
    stepButtons,
    valueAsNumber
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const FormatCurrency: Story;
export declare const FormatPercent: Story;
export declare const FormatUnit: Story;
export declare const MinMax: Story;
export declare const Readonly: Story;
export declare const Required: Story;
export declare const CustomValidity: Story;
export declare const StepButtonsEnd: Story;
export declare const StepButtonsEdges: Story;
export declare const All: Story;
