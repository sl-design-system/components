import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { SelectYear } from './select-year.js';
type Props = Pick<SelectYear, 'max' | 'min' | 'selected' | 'showCurrent' | 'year'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    year: Date;
  };
  argTypes: {
    max: {
      control: 'date';
    };
    min: {
      control: 'date';
    };
    selected: {
      control: 'date';
    };
    showCurrent: {
      control: 'boolean';
    };
    year: {
      control: 'date';
    };
  };
  render: ({
    max,
    min,
    selected,
    showCurrent,
    year
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const MinMax: Story;
export declare const Selected: Story;
export declare const ShowCurrent: Story;
export declare const Year: Story;
export declare const All: Story;
