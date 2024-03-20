import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { InlineMessage, type InlineMessageVariant } from './inline-message';

const variants: InlineMessageVariant[] = ['info', 'success', 'warning', 'danger'];
const dismissible: string[] = ['true', 'false'];
const noIcon: string[] = ['', 'true'];

const onClick = (event: Event, variant?: InlineMessageVariant): void => {
  const newInlMessage = new InlineMessage();
  newInlMessage.variant = variant || 'info';
  newInlMessage.innerHTML = '<span slot="title">Inline message title</span>' + 'Message body text';
  (event.target as HTMLElement).nextElementSibling?.after(newInlMessage);
};

const onClose = (): void => {
  (document.querySelector('sl-inline-message') as InlineMessage)?.remove();
};

export default {
  title: 'Components/Inline message'
};

export const API: StoryObj = {
  args: {
    dismissible: true,
    variant: 'info',
    noIcon: false,
    bodyContent: 'The main content of the message',
    title: 'Inline message title',
    details: 'A place for details like errors list'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger']
    }
  },
  render: ({ title, bodyContent, dismissible, variant, noIcon, details }) => {
    return html`
      <sl-inline-message ?dismissible=${dismissible} ?no-icon=${noIcon} variant=${variant}>
        <span slot="title">${title}</span>
        ${bodyContent}
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
        ${variants.map(
          variant =>
            html`<tr>
              <td>Variant: <strong>${variant}</strong></td>
              ${noIcon.map(
                noIconEl => html`
                  <td>
                    <sl-inline-message ?no-icon=${noIconEl} ?dismissible=${dismissible} variant=${variant}>
                      <span slot="title">Variant ${variant} inline message title</span>
                      The main content of the message
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
    <sl-inline-message variant="danger">
      <span slot="title">Variant danger inline message</span>
      Body text of the message
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
