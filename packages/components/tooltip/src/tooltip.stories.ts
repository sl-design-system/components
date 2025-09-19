import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/dialog/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/spinner/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { tooltip } from './tooltip-directive.js';
import { type Tooltip } from './tooltip.js';

type Props = Pick<Tooltip, 'maxWidth' | 'position'> & {
  alignSelf: string;
  justifySelf: string;
  example?(props: Props): TemplateResult;
  message: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Tooltip',
  tags: ['stable'],
  args: {
    alignSelf: 'center',
    justifySelf: 'center',
    maxWidth: 160,
    message: 'This is the tooltip message',
    position: 'top'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    example: {
      table: { disable: true }
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    position: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ]
    }
  },
  render: props => {
    const { alignSelf, example, justifySelf, message, position, maxWidth } = props;

    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
      </style>
      ${example
        ? example?.(props)
        : html`
            <sl-button
              aria-describedby="tooltip"
              style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}
            >
              Button
            </sl-button>
            <sl-tooltip id="tooltip" .position=${position} .maxWidth=${maxWidth}>${message}</sl-tooltip>
          `}
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Directive: Story = {
  args: {
    example: ({ alignSelf, justifySelf, message }) => html`
      <sl-button ${tooltip(message)} style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}>
        Button
      </sl-button>
    `
  }
};

export const DirectiveWithOptions: Story = {
  render: () => {
    return html`
      <style>
        .container {
          display: grid;
          height: calc(20rem);
          place-items: center;
        }
      </style>
      <p>
        This story demonstrates hot to use the tooltip directive with some inline options
        (custom 'ariaRelation', custom 'position' and 'maxWidth') on a <code>sl-button</code>.
        The example shows how to add a tooltip directly without a separate <code>sl-tooltip</code> element.
      </p>

      <div class="container">
        <sl-button
          variant="primary"
          fill="solid"
          ${tooltip('My tooltip example', { ariaRelation: 'label', position: 'bottom-start', maxWidth: 100 })}
        >
          <sl-icon name="face-smile" size="lg"></sl-icon>
        </sl-button>
      </div>
    `;
  }
};

export const Shared: Story = {
  args: {
    example: ({ alignSelf, justifySelf, message }) => html`
      <sl-button-bar style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}>
        <sl-button aria-describedby="tooltip" fill="outline"><sl-spinner></sl-spinner> We</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">all</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">share</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">the</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">same</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">tooltip</sl-button>
      </sl-button-bar>
      <sl-tooltip id="tooltip">${message}</sl-tooltip>
    `
  },
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false, prefersReducedMotion: 'reduce' }
  }
};

export const NestedChildren: Story = {
  args: {
    example: ({ message }) => html`
      This example is not necessarily a good practice, but it shows that the tooltip can be used on an element that has
      many (interactive) child elements.
      <div
        style="border: 1px solid black; padding: 20px; margin: 20px"
        aria-describedby="task-details-not-available-tooltip"
        @click=${(e: MouseEvent) => console.log('Div clicked', e)}
        tabindex="0"
      >
        <sl-button aria-describedby="tooltip"> Some button </sl-button>
        <p>The div has a tooltip attached, hovering over the child elements will not cause the tooltip to dissapear.</p>
        <p>
          Please beware when using the tooltip in a similar scenario: Not all elements are reachable by all
          screenreaders. A div for example, without any interactions or a role, will not be announced in a special way
          by the screenreader, so it also has no "stop" to read out the contents of the tooltip.
        </p>
        <p>
          Tooltips will be shown for user using keyboard navigation when the element has focus. That means you can only
          use tooltips on elements that are focusable, like buttons or links. If the element you want to describe can
          not have the focus you will need to use something like an info button that will show the tooltip.
          <sl-button> Some button </sl-button>
        </p>
      </div>
      <sl-button aria-label="Look" fill="outline" aria-describedby="tooltip">
        <sl-icon name="eye"></sl-icon>
      </sl-button>
      <sl-tooltip id="task-details-not-available-tooltip"> Tooltip on the div </sl-tooltip>
      <sl-tooltip id="tooltip">${message}</sl-tooltip>
    `
  }
};

export const IconButton: Story = {
  render: () => {
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(20rem);
          place-items: center;
        }
      </style>
      <sl-button aria-labelledby="tooltip" variant="primary" fill="solid" shape="pill" size="md">
        <sl-icon name="face-smile"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip" position="top">
        This is the tooltip message that labels the icon only button.
      </sl-tooltip>
    `;
  }
};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-button').forEach(button => {
        button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      });
    });
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(20rem);
          place-items: center;
        }
      </style>
      <sl-button aria-describedby="tooltip"> Button </sl-button>
      <sl-tooltip id="tooltip" position="top" max-width="300">This is the tooltip message</sl-tooltip>
    `;
  }
};

export const Dialog: Story = {
  render: () => {
    const onClick = async (event: Event & { target: HTMLElement }) => {
      const dialog = document.createElement('sl-dialog');
      dialog.innerHTML = `
        <span slot="title">Tooltip</span>
        Tooltip should be closed when the dialog is closed..
        <sl-button slot="primary-actions" sl_dialog_close variant="primary">Close</sl-button>
      `;
      dialog.addEventListener('sl-close', () => dialog.remove());
      event.target.insertAdjacentElement('afterend', dialog);
      await dialog.updateComplete;
      dialog.showModal();
    };

    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(20rem);
          place-items: center;
        }
      </style>
      <sl-button aria-describedby="tooltip" @click=${onClick}> Button </sl-button>
      <sl-tooltip id="tooltip" position="top" max-width="300">This is the tooltip message</sl-tooltip>
    `;
  }
};
