import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { SelectDay } from './select-day.js';
type Props = Pick<
  SelectDay,
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'indicatorDates'
  | 'max'
  | 'min'
  | 'month'
  | 'readonly'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    month: Date;
    showToday: true;
  };
  argTypes: {
    disabledDates: {
      control: 'object';
    };
    firstDayOfWeek: {
      control: 'inline-radio';
      options: number[];
    };
    indicatorDates: {
      control: 'object';
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
    readonly: {
      control: 'boolean';
    };
    selected: {
      control: 'date';
    };
    showToday: {
      control: 'boolean';
    };
    showWeekNumbers: {
      control: 'boolean';
    };
  };
  render: ({
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    max,
    min,
    month,
    readonly,
    selected,
    showToday,
    showWeekNumbers
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const DisabledDates: Story;
export declare const Indicators: Story;
export declare const Max: Story;
export declare const Min: Story;
export declare const MinMax: Story;
export declare const Readonly: Story;
export declare const Selected: Story;
export declare const SundayFirst: Story;
export declare const WeekNumbers: Story;
export declare const All: Story;
