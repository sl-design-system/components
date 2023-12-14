import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { faOctagonExclamation } from '@fortawesome/pro-solid-svg-icons';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

Icon.registerIcon(faOctagonExclamation);

export type InlineMessageStatus = 'info' | 'success' | 'warning' | 'danger';

// const iconName2 = (status: InlineMessageStatus): string => {
//   switch (status) {
//     case 'info':
//       return 'info';
//     case 'success':
//       return 'circle-check-solid';
//     case 'warning':
//       return 'fas-octagon-exclamation';
//     case 'danger':
//       return 'triangle-exclamation-solid';
//     default:
//       return 'info';
//   }
// };

/**
 * An inline message component for displaying additional information/errors.
 *
 * @slot default - title content for the inline message
 * @slot description - slot for additional information and more content for the inline-message
 * @slot details - slot for more details of the inline-message like list of errors
 * @slot icon - icon shown on the left side of the component
 * @slot close-button - Closing button for the inline message
 */
@localized()
export class InlineMessage extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @private */
  #iconName!: string;

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  /** @private */
  @query('.inline-message-wrapper') wrapper?: HTMLDivElement;

  /** Determines whether closing button (default one) should be shown in the top right corner. */
  @property({ type: Boolean, reflect: true }) dismissible = true;

  /** Determines whether the icon should be shown on the left side of the component. */
  @property({ type: Boolean, attribute: 'no-icon' }) noIcon?: boolean;

  /** The status of the inline message.
   * @type {'info' | 'success' | 'warning' | 'danger'} */
  @property({ reflect: true }) status: InlineMessageStatus = 'info';

  set iconName(name: string) {
    this.#iconName = name;
    this.requestUpdate('iconName');
  }

  get iconName(): string {
    switch (this.status) {
      case 'info':
        return 'info';
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'fas-octagon-exclamation';
      case 'danger':
        return 'triangle-exclamation-solid';
      default:
        return 'info';
    }
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this.status === 'danger' || this.status === 'warning') {
      this.setAttribute('role', 'alert');
    } else {
      this.setAttribute('role', 'status');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="inline-message-wrapper" open>
        <div class="content">
          ${!this.noIcon
            ? html`<slot name="icon" part="icon">
                <sl-icon name=${this.iconName} size="md"></sl-icon>
              </slot>`
            : nothing}
          <div class="content-details">
            <slot name="title" part="title">
              <slot></slot>
            </slot>
            <slot name="description" part="description"></slot>
            <slot name="details" part="details"></slot>
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
  }

  onClose(): void {
    this.wrapper?.removeAttribute('open');
    this.#closeOnAnimationend();
  }

  #closeOnAnimationend(): void {
    console.log('closeOnAnimationend', this.wrapper);
    this.wrapper?.addEventListener(
      'animationend',
      () => {
        this.wrapper?.removeAttribute('open');
        this.remove();
      },
      { once: true }
    );

    requestAnimationFrame(() => {
      this.wrapper?.setAttribute('close', '');
    });
  }
}
