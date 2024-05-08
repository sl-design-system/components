import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { InlineMessage } from '@sl-design-system/inline-message';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { type FormController } from './form-controller.js';
import styles from './form-validation-errors.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-form-validation-errors': FormValidationErrors;
  }
}

@localized()
export class FormValidationErrors extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-inline-message': InlineMessage
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #onUpdate = () => {
    this.validity = this.controller?.showValidity ? (this.controller?.invalid ? 'invalid' : 'valid') : undefined;

    if (this.validity === 'invalid') {
      this.invalidControls =
        this.controller?.element?.controls
          .filter(control => !control.valid)
          .reduce((acc, control) => {
            const label =
              control.labels?.[0]?.textContent?.trim() || control.getAttribute('aria-label') || control.name!;

            return { ...acc, [label]: control };
          }, {}) ?? {};
    } else {
      this.invalidControls = {};
    }
  };

  /** The form controller to listen to. */
  @property({ attribute: false }) controller?: FormController;

  /** The invalid controls in the form. */
  @state() invalidControls: Record<string, HTMLElement> = {};

  /** The validity of the form. */
  @state() validity?: 'valid' | 'invalid';

  /** The variant of the inline message. */
  @state() variant?: 'danger' | 'success';

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('controller')) {
      if (this.controller) {
        this.controller?.addEventListener('sl-update', this.#onUpdate);
      } else {
        changes.get('controller')?.removeEventListener('sl-update', this.#onUpdate);
      }
    }

    if (changes.has('validity')) {
      if (this.validity === 'valid' && changes.get('validity') === 'invalid') {
        // If the validity switch from invalid to valid, we want to show the success message
        this.variant = 'success';
      } else if (this.validity === 'invalid') {
        this.variant = 'danger';
      } else {
        this.variant = undefined;
      }

      this.style.display = this.variant ? 'block' : '';
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-inline-message .variant=${this.variant}>
        ${this.variant === 'danger'
          ? html`
              ${msg('The following fields have errors:')}
              <ul>
                ${Object.entries(this.invalidControls).map(
                  ([label, control]) => html`<li><a @click=${this.#onClick} href="#${control.id}">${label}</a></li>`
                )}
              </ul>
            `
          : msg('All fields are valid.')}
      </sl-inline-message>
    `;
  }

  #onClick(event: Event & { target: HTMLAnchorElement }): void {
    event.preventDefault();

    (this.getRootNode() as HTMLElement).querySelector<HTMLElement>(event.target.hash)?.focus();
  }
}
