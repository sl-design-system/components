import { CalendarComponent } from '@sl-design-system/angular/calendar';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Date & Time',
  decorators: [
    moduleMetadata({
      imports: [CalendarComponent]
    })
  ]
} as Meta;

export const Calendar: StoryObj = {
  render: () => ({
    description: 'A calendar component for selecting dates.',
    template: '<sl-calendar></sl-calendar>'
  })
};
