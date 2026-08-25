import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { SelectMonth } from './select-month.js';
type Props = Pick<SelectMonth, 'max' | 'min' | 'month' | 'selected' | 'showCurrent'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    month: Date;
  };
  argTypes: {
    max: {
      control: 'date';
    };
    min: {
      control: 'date';
    };
    month: {
      control: 'date';
    };
    selected: {
      control: 'date';
    };
    showCurrent: {
      control: 'boolean';
    };
  };
  render: ({
    max,
    min,
    month,
    selected,
    showCurrent
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const MinMax: Story;
export declare const Selected: Story;
export declare const ShowCurrent: Story;
export declare const All: Story;
