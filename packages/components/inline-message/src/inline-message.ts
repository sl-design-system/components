import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

export type InlineMessageStatus = 'info' | 'success' | 'warning' | 'danger';

const iconName = (status: InlineMessageStatus): string => {
  switch (status) {
    case 'info':
      return 'info';
    case 'success':
      return 'circle-check-solid';
    case 'warning':
      return 'triangle-exclamation-solid';
    case 'danger':
      return 'triangle-exclamation-solid';
    default:
      return 'info';
  }
};

/**
 * A dialog component for displaying modal UI.
 *
 * @slot default - Title content for the inline message
 * @slot description - slot for additional information and more content for the inline-message
 * TODO: add more info
 *
 * @slot actions - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot close-button - Closing button (placed in header) for the dialog
 * @slot header-buttons - More space for buttons for the dialog's header
 * @slot title - The title of the dialog
 * @slot subtitle - The subtitle of the dialog
 */
@localized()
export class InlineMessage extends ScopedElementsMixin(LitElement) {
  // TODO: extends lit element or scoped???
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  /** @private */
  @query('.inline-message-wrapper') wrapper?: HTMLDivElement;

  /** Determines whether closing button (default one) should be shown in the top right corner. */
  @property({ type: Boolean, reflect: true }) dismissible = true; // TODO: irremovable

  /** Determines whether the icon should be shown on the left side of the component. */
  @property({ type: Boolean, attribute: 'no-icon' }) noIcon?: boolean;

  /** The status of the inline message.
   * @type {'info' | 'success' | 'warning' | 'danger'} */
  @property({ reflect: true }) status: InlineMessageStatus = 'info';

  constructor() {
    super();

    // requestAnimationFrame(() => {
    //   this.setAttribute('open', '');
    // });
    // this.setAttribute('open', '');
    // if (this.status === 'danger') {
    //   this.setAttribute('role', 'alert');
    // }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.status === 'danger') {
      this.setAttribute('role', 'alert');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="inline-message-wrapper" open>
        <div class="content">
          ${this.noIcon
            ? nothing
            : html`
                <slot name="icon" part="icon">
                  <sl-icon name=${iconName(this.status)} size="md"></sl-icon>
                </slot>
              `}
          <div class="content-details">
            <slot name="title" part="title" aria-live="polite">
              <slot></slot>
            </slot>
            <slot name="description" part="description"> </slot>
            <slot name="details" part="details"> </slot>
          </div>
        </div>
        ${this.dismissible
          ? html`
              <slot name="close-button" @click=${this.onClose}>
                <sl-button fill="ghost" variant="default" size="sm" aria-label=${msg('Close')}>
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              </slot>
            `
          : nothing}
      </div>
    `;
  } // TODO: aria label with translation (${msg('optional')})

  //
  //TODO: show method
  onClose(): void {
    this.wrapper?.removeAttribute('open');

    this.#closeOnAnimationend();

    // this.remove();
    // this.emit('sl-removed');
    // TODO: append to add/show?

    // this.#closeDialogOnAnimationend(event.target as HTMLElement);

    // TODO: emit sl-close
  }

  #closeOnAnimationend(): void {
    console.log('closeOnAnimationend', this.wrapper);
    this.wrapper?.addEventListener(
      'animationend',
      () => {
        this.wrapper?.removeAttribute('open');

        this.remove(); // TODO: emit sl-close event or sth similar?
      },
      { once: true }
    );

    requestAnimationFrame(() => {
      this.wrapper?.setAttribute('close', '');
    });
  }
}
