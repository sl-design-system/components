// import type { Dialog } from './dialog.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';
import { InlineMessage } from './inline-message';

const onClick = (event: Event & { target: HTMLElement }): void => {
  console.log(event);
  /*const newInlMessage = html`<sl-inline-message closing-button status="info">
    <span slot="title">Title</span>
    <span slot="subtitle">Text inside</span>
    bla bla bla
    <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
    <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
  </sl-inline-message>`;*/

  // const div = document.createElement('div');
  // div.innerText = this.hint;

  // TODO: id and accessibility part

  const newInlMessage = new InlineMessage(); //document.createElement('sl-inline-message');
  newInlMessage.innerHTML =
    'Inline message title' + '\n    bla bla bla\n    <span slot="description">Description text</span>';

  // const newInlMessage = `<sl-inline-message closing-button status="info">
  //   <span slot="title">Title</span>
  //   <span slot="subtitle">Text inside</span>
  //   bla bla bla
  //   <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
  //   <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
  // </sl-inline-message>` as Node;
  //document.documentElement.appendChild(newInlMessage);
  event.target.after(newInlMessage);

  // newInlMessage?.addEventListener('sl-close', () => {
  //   console.log('close event', event);
  // });

  // event.target.append(newInlMessage);
  // document.documentElement.append(new InlineMessage);
  // (event.target.nextElementSibling as Dialog).showModal();
  // return newInlMessage;
};

const onClose = (): void => {
  (document.querySelector('sl-inline-message') as InlineMessage)?.onClose();
};

export default {
  title: 'Inline message'
};

export const API: StoryObj = {
  args: {
    closingButton: true,
    status: 'info',
    noIcon: false,
    description: 'Description text',
    bodyContent: `Inline message title`
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger']
    }
  },
  render: ({ description, bodyContent, closingButton, status, noIcon }) => {
    return html`
      <style>
        sl-inline-message {
          margin: 24px auto;
        }
      </style>
      <sl-button fill="outline" size="md" @click=${onClick}>Show inline message</sl-button>
      <sl-button fill="outline" size="md" @click=${onClose}>Close inline message</sl-button>
      <sl-inline-message ?closing-button=${closingButton} ?no-icon=${noIcon} status=${status}>
        ${bodyContent}
        <span slot="description">${description}</span>
      </sl-inline-message>
    `;
  }
};

export const ShowInlineMessage: StoryObj = {
  render: () => html`
    <style>
      sl-inline-message {
        margin: 24px auto;
      }

      sl-button-bar[reverse] > sl-button:first-child {
        margin-left: auto;
      }

      sl-button-bar:not([reverse]) > sl-button:first-child {
        margin-right: auto;
      }

      @media screen and (max-width: 600px) {
        sl-button-bar {
          align-items: stretch;
          flex-direction: column-reverse;
          flex-grow: 1;
          flex-shrink: 0;
        }

        sl-button-bar[reverse] > sl-button:first-child {
          margin-left: inherit;
        }

        sl-button-bar:not([reverse]) > sl-button:first-child {
          margin-right: inherit;
        }
      }
    </style>
    <sl-button fill="outline" @click=${onClick}>Show inline message</sl-button>
    <sl-button fill="outline" size="md" @click=${onClose}>Close inline message</sl-button>
  `
};

export const DisableClose: StoryObj = {
  render: () => html`
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-dialog disable-close closing-button align="space-between">
      <span slot="title">Disable close</span>
      <p>You cannot close me by pressing the Escape key, or clicking the backdrop.</p>
      <sl-button slot="actions" fill="solid" variant="default" sl-dialog-close autofocus>Action 2</sl-button>
      <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
    </sl-dialog>
  `
};

// TODO: with errors list example

export const ErrorsList: StoryObj = {
  render: () => html`
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-inline-message status="danger">
      Status danger inline message
      <span slot="description">A place for additional description</span>
      <span slot="details">A place for details like errors list</span>
    </sl-inline-message>
  `
};
