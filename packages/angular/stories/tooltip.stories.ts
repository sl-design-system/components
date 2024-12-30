import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { TooltipDirective } from '../src/tooltip.directive';

export default {
  title: 'Tooltip',
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, TooltipDirective]
    })
  ]
} as Meta;

export const Directive: StoryObj = {
  render: () => ({
    template: '<sl-button slTooltip="Hello World">Hover me</sl-button>'
  })
};
