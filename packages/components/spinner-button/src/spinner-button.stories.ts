import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type SpinnerButton } from './spinner-button.js';

type Props = Pick<SpinnerButton, 'fill' | 'size' | 'spinning' | 'variant'> & {
  initialText: string;
  spinningText: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Actions/Spinner button',
  tags: ['draft'],
  args: {
    initialText: 'Save',
    spinning: false,
    spinningText: 'Saving'
  },
  render: ({ fill, initialText, size, spinning, spinningText, variant }) => {
    const onClick = (event: Event & { target: SpinnerButton }) => {
      event.target.spinning = !event.target.spinning;
    };

    return html`
      <sl-spinner-button
        @click=${onClick}
        ?spinning=${spinning}
        fill=${ifDefined(fill)}
        size=${ifDefined(size)}
        variant=${ifDefined(variant)}
      >
        <span slot="initial">${initialText}</span>
        <span slot="spinning">${spinningText}</span>
      </sl-spinner-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
