import type { Popover } from './popover.js';
import type { Button } from '@sl-design-system/button';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/text-field/register.js';
import { anchor } from '@sl-design-system/shared';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../register.js';

type Props = Pick<Popover, 'position'>;
type Story = StoryObj<Props>;

export default {
  title: 'Popover',
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    position: 'top'
  },
  argTypes: {
    position: {
      control: 'inline-radio',
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
  render: ({ position }) => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;
      // (event.target as Button).style.setProperty("background-color", "yellow");

      popover.togglePopover();
    };

    return html`
      <sl-button @click=${onClick} id="button" variant="primary">Toggle popover</sl-button>
      <sl-popover anchor="button" position=${ifDefined(position)}
        >I'm <br>a <br></br>popover <br />
        example</sl-popover
      >
<!--      <button popovertarget="my-popover">Open Popover</button>-->
<!--      <div id="my-popover" popover>-->
<!--        <p>I am a popover.</p>-->
<!--      </div>-->
    `;
  }
};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => popover.showPopover());
    });

    return html`
      <style>
        div {
          margin: 88px;
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

export const MoreComplexContent: Story = {
  render: () => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;

      popover.togglePopover();
    };

    return html`
      <style>
        header {
          font: var(--sl-text-popover-text-title);
        }

        hr {
          margin: 8px 0;
        }

        footer {
          display: flex;
          gap: 8px;
          justify-content: end;
        }
      </style>
      <div>
        <sl-button id="anchor" variant="primary" @click=${onClick}>Toggle popover</sl-button>
        <sl-popover anchor="anchor">
          <header>Please confirm</header>
          <section>
            <hr color="#D9D9D9" />
            Are you sure you want to continue?
            <hr color="#D9D9D9" />
          </section>
          <footer>
            <sl-button size="sm">Cancel</sl-button>
            <sl-button size="sm" variant="primary">Confirm</sl-button>
          </footer>
        </sl-popover>
      </div>
    `;
  }
};

export const Dialog: Story = {
  render: () => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;

      popover.togglePopover();
    };

    return html`
      <!--added this to get the polyfill working in FF and Safari-->
      <style>
        [popover],
        :host(:where([popover])) {
          background-color: canvas;
          border-color: initial;
          border-image: initial;
          border-style: solid;
          border-width: initial;
          color: canvastext;
          height: fit-content;
          margin: auto;
          overflow: auto;
          padding: 0.25em;
          position: fixed;
          width: fit-content;
          z-index: 2147483647;
        }

        [popover] {
          inset: 0;
        }

        [popover]:not(.\\:popover-open),
        :host([popover]:not(.\\:popover-open)) {
          display: none;
        }

        [popover]:is(dialog[open], .\\:popover-open) {
          display: block;
        }

        [anchor].\\:popover-open {
          inset: auto;
        }

        @supports selector([popover]:popover-open) {
          [popover]:not(.\\:popover-open, dialog[open]),
          :host([popover]:not(.\\:popover-open, dialog[open])) {
            display: revert;
          }

          [anchor]:is(:popover-open) {
            inset: auto;
          }
        }
      </style>
      <sl-button @click=${onClick} id="button">Toggle popover</sl-button>
      <dialog anchor="button" popover ${anchor({ position: 'bottom' })}>I'm a popover</dialog>
    `;
  }
};

export const Edges: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => popover.showPopover());
    });

    return html`
      <style>
        #anchor1 {
          inset: 0 auto auto 50%;
          position: fixed;
          translate: -50%;
        }
        #anchor2 {
          inset: 50% 0 auto auto;
          position: fixed;
          translate: 0 -50%;
        }
        #anchor3 {
          inset: auto auto 0 50%;
          position: fixed;
          translate: -50%;
        }
        #anchor4 {
          inset: 50% auto auto 0;
          position: fixed;
          translate: 0 -50%;
        }
      </style>
      <span id="anchor1">Popover</span>
      <span id="anchor2">Popover</span>
      <span id="anchor3">Popover</span>
      <span id="anchor4">Popover</span>
      <sl-popover anchor="anchor1" popover="manual" position="top">Top</sl-popover>
      <sl-popover anchor="anchor2" popover="manual" position="right">Right</sl-popover>
      <sl-popover anchor="anchor3" popover="manual" position="bottom">Bottom</sl-popover>
      <sl-popover anchor="anchor4" popover="manual" position="left">Left</sl-popover>
    `;
  }
};

export const Focus: Story = {
  render: () => {
    const onClick = (event: Event & { target: Button }): void => {
      const popover = event.target.nextElementSibling as HTMLElement;

      popover.togglePopover();
    };

    return html`
      <style>
        sl-popover form {
          align-items: center;
          display: grid;
          gap: 0.5rem;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr 1fr;
        }
        sl-button-bar {
          grid-column: 1 / -1;
        }
      </style>
      <sl-button @click=${onClick} id="button" variant="primary">Toggle popover</sl-button>
      <sl-popover anchor="button">
        <form>
          <label>Label</label>
          <sl-text-field placeholder="Input"></sl-text-field>
          <sl-button-bar align="end">
            <sl-button size="sm" variant="primary">Save</sl-button>
          </sl-button-bar>
        </form>
      </sl-popover>
    `;
  }
};
