import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import '@sl-design-system/button/register.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Dialog } from '@sl-design-system/dialog';
import { InlineMessage } from '@sl-design-system/inline-message';
import { Form, FormField } from '@sl-design-system/form';
import { Select, SelectOption } from '@sl-design-system/select';
import { Textarea } from '@sl-design-system/textarea';
import { TextField } from '@sl-design-system/text-field';
import { type StoryObj } from '@storybook/web-components';
import { LitElement, css, html, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import type { SlChangeEvent } from '@sl-design-system/shared/events.js';
import { state } from 'lit/decorators.js';

type Story = StoryObj;

class ChangeTypeDialog extends ScopedElementsMixin(LitElement) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-dialog': Dialog,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-inline-message': InlineMessage,
      'sl-select': Select,
      'sl-select-option': SelectOption,
      'sl-textarea': Textarea,
      'sl-text-field': TextField,
    };
  }

  static styles: CSSResultGroup = css`
    sl-inline-message {
      margin-block-end: 1rem;
    }
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
  `;

  get dialog(): Dialog {
    return this.renderRoot.querySelector('sl-dialog')!;
  }

  get form(): Form {
    return this.renderRoot.querySelector('sl-form')!;
  }

  rentalPeriod: 'indefinite' | number = 'indefinite';

  override render(): TemplateResult {
    return html`
      <sl-dialog>
        <span slot="title">Change locker type</span>
        ${this.form?.showValidity && !this.form?.valid
            ? html`<sl-inline-message variant="danger">The following fields have errors: </sl-inline-message>`
            : nothing
          }
        <sl-form>
          <sl-form-field label="Type">
            <sl-text-field name="type" required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Description">
            <sl-textarea name="description"></sl-textarea>
          </sl-form-field>

          <sl-form-field label="Rental period">
            <sl-checkbox @sl-change=${this.#onChange} ?checked=${this.rentalPeriod === 'indefinite'} name="period" required value="indefinite">Indefinitely</sl-checkbox>
            <div class="wrapper">
              <sl-text-field ?disabled=${this.rentalPeriod === 'indefinite'} name="period" value="0"></sl-text-field>
              <sl-select ?disabled=${this.rentalPeriod === 'indefinite'}>
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
        <sl-button @click=${this.#onSave} slot="actions" variant="primary">Save</sl-button>
      </sl-dialog>
      <pre>
        ${JSON.stringify(this.form?.value)}
      </pre>
    `;
  }

  showModal(): void {
    this.dialog.showModal();
  }

  #onChange(event: SlChangeEvent<'indefinite' | null>): void {
    this.rentalPeriod = event.detail === 'indefinite' ? 'indefinite' : parseInt(this.querySelector<TextField>('sl-text-field[name="period"]')?.value || '0');
    this.requestUpdate();
  }

  #onSave(): void {
    if (this.form.valid) {
      this.dialog.close();
    } else {
      this.form.reportValidity();
      this.requestUpdate();
    }
  }
}

export default {
  title: 'Experiments/Lockers'
}

export const Default: Story = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as ChangeTypeDialog)?.showModal();
    }

    try {
      customElements.define('change-type-dialog', ChangeTypeDialog);
    } catch {}

    return html`
      <sl-button @click=${onClick}>Show dialog</sl-button>
      <change-type-dialog></change-type-dialog>
    `;
  }
};
