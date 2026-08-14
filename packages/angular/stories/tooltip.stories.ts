import { TooltipDirective } from '@sl-design-system/angular';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

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
    description:
      'Use slTooltip on any element. In Angular, style the generated `sl-tooltip` element directly.',
    template: `
      <style>
        .tooltip-demo {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-start;
        }

        .part-tooltip + sl-tooltip {
          display: block;
          inline-size: 50px;
          box-sizing: border-box;
          overflow-wrap: anywhere;
          padding-inline: 0;
          --sl-tooltip-position-area: right;
        }
      </style>

      <div class="tooltip-demo">
        <sl-button slTooltip="Hello World">Default tooltip</sl-button>

        <sl-button class="part-tooltip" slTooltip="Styled through a sibling selector">
          Tooltip with CSS selector styling
        </sl-button>
      </div>
    `
  })
};
