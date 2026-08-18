import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { IconComponent } from '../src/icon/icon.component';
import { TooltipDirective } from '../src/tooltip.directive';

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
      imports: [ButtonComponent, IconComponent, TooltipDirective]
    })
  ]
} as Meta;

export const Directive: StoryObj = {
  render: () => ({
    description: `Use \`slTooltip\` on focusable elements.

How it works:
- The directive creates an \`<sl-tooltip>\` next to the element when text is set.
- It updates the tooltip when inputs change.
- It removes the tooltip when text is empty.

Type options:
- \`Default\` (\`aria-labelledby\`): use with icon-only triggers, for example \`slTooltip="..."\`
- \`Description\` (\`aria-describedby\`): use with elements that already have visible text, for example \`[slTooltip]="{ text: '...', type: 'description' }"\`

If local styles do not work, use a global selector to style generated tooltips.

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
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          min-block-size: 100vh;
          gap: 1rem;
        }
      </style>

      <div class="tooltip-demo">
        <sl-button slTooltip="More information about this action">
          <sl-icon name="face-smile"></sl-icon>
        </sl-button>

        <sl-button [slTooltip]="{ text: 'Tooltip used as aria description for a text button', type: 'description' }">
          Tooltip with type
        </sl-button>

        <sl-button class="styled-tooltip-trigger" [slTooltip]="{ text: 'Styled tooltip on the right with max-inline-size set', type: 'description' }">
          Styled tooltip
        </sl-button>
      </div>
    `
  })
};
