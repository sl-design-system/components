import type { Drawer } from './drawer.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import './register.js';

export default {
  title: 'Drawer',
  args: {
    attachment: 'right'
  },
  argTypes: {
    attachment: {
      control: 'radio',
      options: ['right', 'left', 'top', 'bottom']
    }
  }
};

const onClick = (event: Event & { target: HTMLElement }): void => {
  (event.target.nextElementSibling as Drawer).showModal();
};

export const API: StoryObj = {
  render: ({ attachment, size }) => {
    return html`
      <sl-button @click=${onClick}>Show Drawer</sl-button>
      <sl-drawer .attachment=${attachment} .drawersize=${size}>
        <span slot="title">Drawer title</span>
        <p>
          Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
          tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.
          Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
          anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
          magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do.
        </p>
      </sl-drawer>
    `;
  }
};

// export const DisableClose: StoryObj = {
//   render: () => html`
//     <sl-button @click=${onClick}>Show Dialog</sl-button>
//     <sl-dialog disable-close>
//       <span slot="title">Disable close</span>
//       <p>You cannot close me by pressing the Escape key, or clicking the backdrop.</p>
//       <sl-button slot="action" sl-dialog-close>Close</sl-button>
//     </sl-dialog>
//   `
// };

// export const ScrollingBody: StoryObj = {
//   render: () => html`
//     <style>
//       sl-button {
//         margin: 50vh 0 100vh;
//       }
//     </style>
//     <sl-button @click=${onClick}>Show Dialog</sl-button>
//     <sl-dialog>
//       <div>You cannot scroll the body once the dialog is open.</div>
//     </sl-dialog>
//   `
// };
