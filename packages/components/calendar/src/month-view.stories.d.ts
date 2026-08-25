import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type MonthView } from './month-view.js';
type Props = Pick<
  MonthView,
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'hideDaysOtherMonths'
  | 'indicatorDates'
  | 'locale'
  | 'max'
  | 'min'
  | 'month'
  | 'readonly'
  | 'renderer'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
> & {
  styles?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    hideDaysOtherMonths: false;
    month: Date;
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
      control: 'date';
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
    renderer: {
      table: {
        disable: true;
      };
    };
    selected: {
      control: 'date';
    };
    styles: {
      table: {
        disable: true;
      };
    };
  };
  render: ({
    disabledDates,
    firstDayOfWeek,
    hideDaysOtherMonths,
    indicatorDates,
    locale,
    max,
    min,
    month,
    readonly,
    renderer,
    selected,
    showToday,
    showWeekNumbers,
    styles
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const FirstDayOfWeek: Story;
export declare const HideDaysOtherMonths: Story;
export declare const MinMax: Story;
export declare const Readonly: Story;
export declare const Renderer: Story;
export declare const Selected: Story;
export declare const Today: Story;
export declare const IndicatorDates: Story;
export declare const DisabledDates: Story;
export declare const WeekNumbers: Story;
export declare const All: Story;
