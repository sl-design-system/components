import { EllipsizeTextComponent } from '@sl-design-system/angular/ellipsize-text';
import { FormatDateComponent } from '@sl-design-system/angular/format-date';
import { FormatNumberComponent } from '@sl-design-system/angular/format-number';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Utility',
  decorators: [
    moduleMetadata({
      imports: [EllipsizeTextComponent, FormatDateComponent, FormatNumberComponent]
    })
  ]
} as Meta;

export const EllipsizeText: StoryObj = {
  render: () => ({
    description:
      'The ellipsize-text component truncates long text with an ellipsis when it exceeds the container width.',
    template: `
      <sl-ellipsize-text style="width: 200px;">
        This is a very long text that will be ellipsized when it exceeds the container width
      </sl-ellipsize-text>
    `
  })
};

export const FormatDate: StoryObj = {
  render: () => ({
    template: '<sl-format-date [date]="new Date()" format="medium"></sl-format-date>'
  })
};

export const FormatNumber: StoryObj = {
  render: () => ({
    template: '<sl-format-number [value]="1234.56" format="currency" currency="USD"></sl-format-number>'
  })
};
