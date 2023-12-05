// import type { Dialog } from './dialog.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
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

  const newInlMessage = new InlineMessage(); //document.createElement('sl-inline-message');
  newInlMessage.innerHTML =
    'Title' + 'Text inside' + '\n    bla bla bla\n    <span slot="description">description</span>';

  // const newInlMessage = `<sl-inline-message closing-button status="info">
  //   <span slot="title">Title</span>
  //   <span slot="subtitle">Text inside</span>
  //   bla bla bla
  //   <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
  //   <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
  // </sl-inline-message>` as Node;
  //document.documentElement.appendChild(newInlMessage);
  event.target.after(newInlMessage);
  // event.target.append(newInlMessage);
  // document.documentElement.append(new InlineMessage);
  // (event.target.nextElementSibling as Dialog).showModal();
  // return newInlMessage;
};

export default {
  title: 'Inline message'
};

export const API: StoryObj = {
  args: {
    closingButton: true,
    status: 'info',
    description: 'Description text',
    bodyContent: `Inline message title`
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger']
    }
  },
  render: ({ description, bodyContent, closingButton, status }) => {
    return html`
      <style>
        sl-inline-message {
          margin: 24px auto;
        }
      </style>
      <sl-button fill="outline" size="md" @click=${onClick}>Show inline message</sl-button>
      <sl-inline-message ?closing-button=${closingButton} status=${status}>
        ${bodyContent}
        <span slot="description">${description}</span>
      </sl-inline-message>
    `;
  }
};

export const MoreFooterButtons: StoryObj = {
  args: {
    reverse: false
  },
  render: ({ reverse }) => html`
    <style>
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
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-dialog closing-button>
      <span slot="subtitle">Dialog subtitle</span>
      <span slot="title">Dialog title</span>
      <div>You cannot scroll the body once the dialog is open.</div>
      <sl-button-bar slot="footer" align="space-between" .reverse=${reverse}>
        <sl-button fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
        <sl-button fill="outline" variant="primary" sl-dialog-close>Action 2</sl-button>
        <sl-button fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
      </sl-button-bar>
    </sl-dialog>
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

export const ScrollingBody: StoryObj = {
  render: () => html`
    <style>
      sl-button {
        margin: 50vh 0 100vh;
      }
    </style>
    <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
    <sl-dialog closing-button>
      <span slot="subtitle">Dialog subtitle example</span>
      <span slot="title">Dialog title example</span>
      <div>You cannot scroll the body once the dialog is open.</div>
    </sl-dialog>
  `
};

export const CustomClosingIcon: StoryObj = {
  render: () => {
    Icon.registerIcon(faCircleXmark);

    return html`
      <sl-button fill="outline" @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog closing-button>
        <span slot="title">Custom icon dialog</span>
        <sl-button slot="close-button" fill="ghost" variant="default">
          <sl-icon name="far-circle-xmark"></sl-icon>
        </sl-button>
        <div>Dialog with custom closing icon</div>
      </sl-dialog>
    `;
  }
};
