import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Checkbox } from './checkbox.js';
type Props = Pick<
  Checkbox,
  | 'checked'
  | 'disabled'
  | 'indeterminate'
  | 'required'
  | 'showValid'
  | 'showValidity'
  | 'size'
  | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
  slot?(): TemplateResult;
  text?: string;
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
    checked: false;
    disabled: false;
    indeterminate: false;
    label: string;
    text: string;
    value: string;
  };
  argTypes: {
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    checked,
    disabled,
    hint,
    indeterminate,
    label,
    reportValidity,
    required,
    showValid,
    size,
    slot,
    text,
    value
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Checked: Story;
export declare const Disabled: Story;
export declare const Empty: Story;
export declare const Indeterminate: StoryObj;
export declare const NoVisibleLabel: StoryObj;
export declare const Infotip: StoryObj;
export declare const Overflow: Story;
export declare const Required: Story;
export declare const Valid: Story;
export declare const CustomValidity: Story;
export declare const CustomAsyncValidity: Story;
