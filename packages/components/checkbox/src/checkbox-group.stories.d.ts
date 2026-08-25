import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import '@sl-design-system/tooltip/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type CheckboxGroup } from './checkbox-group.js';
type Props = Pick<CheckboxGroup, 'disabled' | 'required' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
  boxes?(): TemplateResult;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    a11y: {
      config: {
        rules: (
          | {
              id: string;
              selector: string;
              enabled?: undefined;
            }
          | {
              id: string;
              enabled: boolean;
              selector?: undefined;
            }
        )[];
      };
    };
  };
  args: {
    label: string;
    size: 'md';
  };
  argTypes: {
    disabled: {
      control: 'boolean';
    };
    size: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    boxes,
    disabled,
    hint,
    label,
    required,
    size,
    slot,
    value
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const Required: Story;
export declare const Value: Story;
export declare const ImplicitValue: Story;
export declare const Infotip: Story;
export declare const WithoutValues: Story;
export declare const NoLabel: Story;
export declare const Tooltips: Story;
export declare const CustomValidity: Story;
export declare const CustomAsyncValidity: Story;
