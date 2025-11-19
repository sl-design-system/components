import { ButtonComponent } from '@sl-design-system/angular/button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { TooltipDirective } from '../src/tooltip.directive';

export default {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, TooltipDirective]
    })
  ]
} as Meta;

export const Directive: StoryObj = {
  render: () => ({
    description: 'You can use the tooltip as a directive by adding the slTooltip attribute to any element.',
    template: '<sl-button slTooltip="Hello World">Hover me</sl-button>'
  })
};
