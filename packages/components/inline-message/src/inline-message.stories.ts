import type { InlineMessageStatus } from './inline-message';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';
import { InlineMessage } from './inline-message';

const statuses: InlineMessageStatus[] = ['info', 'success', 'warning', 'danger'];
const dismissible: string[] = ['true', 'false'];
const noIcon: string[] = ['', 'true'];

const onClick = (event: Event, status?: InlineMessageStatus): void => {
  const newInlMessage = new InlineMessage();
  newInlMessage.status = status || 'info';
  newInlMessage.innerHTML = 'Inline message title' + '<span slot="description">Description text</span>';
  (event.target as HTMLElement).nextElementSibling?.after(newInlMessage);
};

const onClose = (): void => {
  (document.querySelector('sl-inline-message') as InlineMessage)?.onClose();
};

export default {
  title: 'Inline message'
};

export const API: StoryObj = {
  args: {
    dismissible: true,
    status: 'info',
    noIcon: false,
    description: 'A place for additional description',
    bodyContent: `Inline message title`,
    details: 'A place for details like errors list'
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger']
    }
  },
  render: ({ description, bodyContent, dismissible, status, noIcon, details }) => {
    return html`
      <sl-inline-message ?dismissible=${dismissible} ?no-icon=${noIcon} status=${status}>
        ${bodyContent}
        <span slot="description">${description}</span>
        <span slot="details">${details}</span>
      </sl-inline-message>
    `;
  }
};

export const All: StoryObj = {
  render: () => html`
    <style>
      table {
        border-collapse: collapse;
        margin-bottom: 24px;
      }

      th {
        text-transform: capitalize;
      }

      td {
        padding: 16px;
      }

      td:first-of-type {
        font-size: 16px;
      }

      strong {
        text-transform: uppercase;
      }

      tbody td:last-of-type {
        border: none;
      }
    </style>
    <table>
      <tbody>
        ${statuses.map(
          status => html`<tr>
            <td>Status: <strong>${status}</strong></td>
            ${noIcon.map(
              noIconEl =>
                html`
                  <td>
                    <sl-inline-message ?no-icon=${noIconEl} ?dismissible=${dismissible} status=${status}>
                      Status ${status} inline message
                      <span slot="description">A place for additional description of the inline message</span>
                      <span slot="details">A place fore more details like errors list</span>
                    </sl-inline-message>
                  </td>
                `
            )}
          </tr>`
        )}
      </tbody>
    </table>
  `
};

export const ShowInlineMessage: StoryObj = {
  render: () => html`
    <style>
      sl-inline-message {
        margin: 24px auto;
      }

      sl-button {
        margin-right: 8px;
      }
    </style>
    <sl-button fill="outline" @click=${onClick}>Show inline message</sl-button>
    <sl-button fill="outline" size="md" @click=${onClose}>Close inline message</sl-button>
  `
};

// TODO: with errors list example

export const ErrorsList: StoryObj = {
  render: () => html`
    <style>
      sl-inline-message {
        margin: 24px auto;
      }
    </style>
    <sl-button
      fill="outline"
      @click=${(event: Event) => {
        onClick(event, 'danger');
      }}
      >Show (error) inline message</sl-button
    >
    <sl-inline-message status="danger">
      Status danger inline message
      <span slot="description">A place for additional description</span>
      <span slot="details">
        <ul>
          <li>Error 1</li>
          <li>Error 2</li>
          <li>Error 3</li>
          <li>Error 4</li>
        </ul>
      </span>
    </sl-inline-message>
  `
};
