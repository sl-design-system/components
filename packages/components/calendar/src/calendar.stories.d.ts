import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Calendar } from './calendar.js';
type Props = Pick<
  Calendar,
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'indicatorDates'
  | 'locale'
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
    readonly: false;
    showToday: false;
    showWeekNumbers: false;
  };
  argTypes: {
    disabledDates: {
      control: 'date';
    };
    firstDayOfWeek: {
      control: 'number';
    };
    indicatorDates: {
      control: {
        type: 'object';
      };
      description: string;
    };
    locale: {
      control: 'inline-radio';
      options: string[];
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
    selected: {
      control: 'date';
    };
  };
  render: ({
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    locale,
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
export declare const FirstDayOfWeek: Story;
export declare const Min: Story;
export declare const Max: Story;
export declare const MinMax: Story;
export declare const Readonly: Story;
export declare const Selected: Story;
export declare const IndicatorDates: Story;
export declare const DisabledDates: Story;
export declare const Today: Story;
export declare const WeekNumbers: Story;
export declare const All: Story;
