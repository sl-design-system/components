import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Popover } from './popover.js';

type Props = Pick<Popover, 'position'> & {
  alignSelf: string;
  body: string | (() => TemplateResult);
  justifySelf: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Components/Popover',
  args: {
    alignSelf: 'center',
    body: "I'm a popover example",
    justifySelf: 'center',
    position: 'bottom'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    body: {
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
  render: ({ alignSelf, justifySelf, body, position }) => {
    const onClick = (): void => {
      const popover = document.querySelector('sl-popover') as HTMLElement;
      popover.togglePopover();
    };

    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
      </style>
      <sl-button
        @click=${onClick}
        id="button"
        variant="primary"
        style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}
        >Toggle</sl-button
      >
      <sl-popover anchor="button" .position=${position}>${typeof body === 'string' ? body : body()}</sl-popover>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const RichContent: Story = {
  args: {
    body: () => {
      const onClose = (event: Event & { target: HTMLElement }): void => {
        event.target.closest('sl-popover')?.hidePopover();
      };

      return html`
        <style>
          header {
            font: var(--sl-text-popover-text-title);
          }

          hr {
            margin: 8px 0;
          }
        </style>
        <header>Please confirm</header>
        <section>
          <hr color="#D9D9D9" />
          Are you sure you want to continue?
          <hr color="#D9D9D9" />
        </section>
        <sl-button-bar align="end">
          <sl-button @click=${onClose} size="sm">Cancel</sl-button>
          <sl-button @click=${onClose} size="sm" variant="primary">Confirm</sl-button>
        </sl-button-bar>
      `;
    }
  }
};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => {
        popover.showPopover();
      });
    });

    return html`
      <style>
        div {
          margin: 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      </style>
      <div>
        <sl-button id="anchor" variant="primary">This is a popover anchor element (sl-button component) </br> with all top and bottom popover allowed positions shown <br> all examples at once</sl-button>
        <sl-popover anchor="anchor" popover="manual" position="top">Top</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="top-start">Top start</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="top-end">Top end</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom">Bottom</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom-start">Bottom start</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom-end">Bottom end</sl-popover>
      </div>

      <div>
        <sl-button id="anchor2" variant="primary" style="width: 72px">This is a popover anchor element (sl-button component) with all right and left popover allowed positions shown all examples at once</sl-button>
        <sl-popover anchor="anchor2" popover="manual" position="right">Right <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="right-start">Right <br> start <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="right-end">Right <br> end <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left">Left <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left-start">Left <br> start <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left-end">Left <br> end <br> example</sl-popover>
      </div>
    `;
  }
};
