import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { SelectMonth } from './select-month.js';
type Props = Pick<SelectMonth, 'month' | 'max' | 'min' | 'showToday'> & {
  styles?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  tags: string[];
  args: {
    month: Date;
    max: Date;
    min: Date;
    showToday: true;
  };
  argTypes: {
    month: {
      control: 'date';
    };
    max: {
      control: 'date';
    };
    min: {
      control: 'date';
    };
    showToday: {
      control: 'boolean';
    };
    styles: {
      table: {
        disable: true;
      };
    };
  };
  render({ month, max, min, styles, showToday }: Props): import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
