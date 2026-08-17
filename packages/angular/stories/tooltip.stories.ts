import { TooltipDirective } from '@sl-design-system/angular';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const styleId = 'tooltip-directive-story-styles',
  styleContent = `
    .styled-tooltip-trigger + sl-tooltip {
      max-inline-size: 70px;
      position-area: right;
    }
  `;

if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = styleContent;
  document.head.append(style);
}

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
    description: `Use slTooltip on focusable elements. If local template styles do not apply, use a global selector to style generated tooltips.

\`\`\`typescript
const styleId = 'tooltip-directive-story-styles',
  styleContent = \`
    .styled-tooltip-trigger + sl-tooltip {
      max-inline-size: 70px;
      position-area: right;
    }
  \`;

if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = styleContent;
  document.head.append(style);
}
\`\`\``,
    template: `
      <style>
        .tooltip-demo {
          display: flex;
          align-items: center;
          justify-content: center;
          min-block-size: 100vh;
          gap: 1rem;
        }
      </style>

      <div class="tooltip-demo">
        <sl-button slTooltip="Tooltip with default styling">Default tooltip</sl-button>

        <sl-button class="styled-tooltip-trigger" slTooltip="Styled tooltip on the right with max-inline-size set">
          Tooltip with custom styling
        </sl-button>
      </div>
    `
  })
};
