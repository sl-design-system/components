import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type SearchField } from './search-field.js';
type Props = Pick<SearchField, 'disabled' | 'placeholder' | 'value'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    placeholder: string;
    value: string;
  };
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  render: ({ disabled, placeholder, value }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
export declare const CustomIcon: Story;
export declare const Value: Story;
export declare const Complete: Story;
export declare const All: Story;
