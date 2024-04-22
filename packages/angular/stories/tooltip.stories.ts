import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { TooltipDirective } from '../src/tooltip.directive';
import { ButtonComponent } from '../src/wrappers';

export default {
  title: 'Tooltip',
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, TooltipDirective]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  render: () => ({
    template: '<sl-button slTooltip="Hello World">Hover me</sl-button>'
  })
};
