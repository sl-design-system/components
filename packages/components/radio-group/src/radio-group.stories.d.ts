import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type RadioGroup } from './radio-group.js';
type Props = Pick<
  RadioGroup,
  'disabled' | 'horizontal' | 'required' | 'showValid' | 'size' | 'value'
> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
  reportValidity?: boolean;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    a11y: {
      config: {
        rules: {
          id: string;
          selector: string;
        }[];
      };
    };
  };
  args: {
    disabled: false;
    horizontal: false;
    label: string;
    required: false;
    showValid: false;
    size: 'md';
    value: null;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
    value: {
      control: 'text';
    };
  };
  render: ({
    disabled,
    hint,
    horizontal,
    label,
    options,
    reportValidity,
    required,
    showValid,
    slot,
    value,
    size
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Horizontal: Story;
export declare const Overflow: Story;
export declare const Infotip: Story;
export declare const Required: Story;
export declare const Valid: Story;
export declare const Value: Story;
export declare const CustomValidity: Story;
export declare const CustomAsyncValidity: Story;
export declare const All: Story;
