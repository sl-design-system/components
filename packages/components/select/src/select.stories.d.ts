import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/listbox/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Select, type SelectSize } from './select.js';
type Props = Pick<
  Select,
  'clearable' | 'disabled' | 'fill' | 'placeholder' | 'required' | 'size' | 'value'
> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
  reportValidity?: boolean;
  slot?(): TemplateResult;
  styles?(): string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    label: string;
    placeholder: string;
    required: false;
    size: 'md';
    value: null;
  };
  argTypes: {
    fill: {
      control: 'inline-radio';
      options: string[];
    };
    size: {
      control: 'inline-radio';
      options: SelectSize[];
    };
    styles: {
      table: {
        disable: true;
      };
    };
    value: {
      control: 'text';
    };
  };
  parameters: {
    a11y: {
      config: {
        rules: {
          /**
           * The rule is disabled for sl-select-button because it uses ariaLabelledByElements to set
           * aria-labelledby across shadow DOM boundaries, which the a11y checker cannot reliably
           * detect.
           */
          id: string;
          enabled: boolean;
          selector: string;
        }[];
      };
    };
  };
  render: ({
    clearable,
    disabled,
    fill,
    hint,
    label,
    options,
    placeholder,
    reportValidity,
    required,
    size,
    slot,
    styles,
    value
  }: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Ghost: Story;
export declare const Clearable: Story;
export declare const Disabled: Story;
export declare const EmbeddedComponents: Story;
export declare const CustomStyling: Story;
export declare const OptionsStyling: Story;
export declare const Empty: Story;
export declare const Groups: Story;
export declare const NoVisibleLabel: StoryObj;
export declare const OptionOverflow: Story;
export declare const Required: Story;
export declare const Selected: Story;
export declare const TextOverflow: Story;
export declare const WordBreak: Story;
export declare const DisplayInlineBlock: Story;
export declare const Valid: Story;
export declare const CustomValidity: Story;
export declare const CustomAsyncValidity: Story;
export declare const HideWhenOutOfView: StoryObj;
export declare const All: Story;
