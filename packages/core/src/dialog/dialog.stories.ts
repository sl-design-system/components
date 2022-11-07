import type { Dialog } from './dialog.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Dialog'
};

export const API: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as Dialog).showModal();
    };

    return html`
      <sl-button @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog>Hello world!</sl-dialog>
    `;
  }
};
