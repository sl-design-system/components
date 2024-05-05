import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/dialog/register.js';
import { type Dialog } from '@sl-design-system/dialog';
import '@sl-design-system/form/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/textarea/register.js';
import '@sl-design-system/text-field/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';

type Story = StoryObj;

export default {
  title: 'Experiments/Lockers'
}

export const Default: Story = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as Dialog)?.showModal();
    }

    return html`
      <style>
        sl-form {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 1fr;
        }
        sl-form-field {
          grid-column: span 2;

          &:nth-last-child(-n + 2) {
            grid-column: span 1;
          }
        }
        .wrapper {
          display: flex;
          gap: 1rem;

          sl-text-field {
            flex-basis: 100px;
          }

          sl-select {
            flex: 1;
          }
        }
      </style>
      <sl-button @click=${onClick}>Show dialog</sl-button>
      <sl-dialog>
        <span slot="title">Change locker type</span>
        <sl-form>
          <sl-form-field label="Type">
            <sl-text-field name="type" required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Description">
            <sl-textarea name="description"></sl-textarea>
          </sl-form-field>

          <sl-form-field label="Rental period">
            <sl-checkbox checked name="period" required value="indefinite">Indefinitely</sl-checkbox>
            <div class="wrapper">
              <sl-text-field disabled name="period" value="0"></sl-text-field>
              <sl-select disabled>
                <sl-select-option>Select duration</sl-select-option>
              </sl-select>
            </div>
          </sl-form-field>

          <sl-form-field label="Rental amount">
            <sl-text-field name="amount" placeholder="0,00" required>
              <span slot="prefix">€</span>
            </sl-text-field>
          </sl-form-field>

          <sl-form-field label="Deposit">
          <sl-text-field name="deposit" placeholder="0,00" required>
              <span slot="prefix">€</span>
            </sl-text-field>
          </sl-form-field>
        </sl-form>
        <sl-button sl-dialog-close fill="outline" slot="actions">Cancel</sl-button>
        <sl-button slot="actions" variant="primary">Save</sl-button>
      </sl-dialog>
    `;
  }
};
