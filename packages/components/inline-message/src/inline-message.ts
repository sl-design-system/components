import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup, PropertyValues } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * An inline message component for displaying additional information/errors.
 *
 * @slot default - slot for the main information of the inline-message
 * @slot title - title content for the inline message
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
  static override styles: CSSResultGroup = [breakpoints, styles];

  /** @private */
  @query('.wrapper') wrapper?: HTMLDivElement;

  /** Determines whether a (default) closing button should be shown in the top right corner. */
  @property({ type: Boolean, reflect: true }) dismissible = true;

  /** Determines whether the icon should be shown on the left side of the component. */
  @property({ type: Boolean, attribute: 'no-icon' }) noIcon?: boolean;

  /** The variant of the inline message.
   * @type {'info' | 'success' | 'warning' | 'danger'} */
  @property({ reflect: true }) variant: InlineMessageVariant = 'info';

  /** @private The name of the icon, depending on the variant of the inline message. */
  get iconName(): string {
    switch (this.variant) {
      case 'info':
        return 'info';
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'octagon-exclamation-solid';
      case 'danger':
        return 'triangle-exclamation-solid';
      default:
        return 'info';
    }
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('variant')) {
      this.setAttribute('role', ['danger', 'warning'].includes(this.variant) ? 'alert' : 'status');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper" open @animationend=${this.#closeOnAnimationend}>
        <div class="content">
          ${this.noIcon
            ? nothing
            : html`<slot name="icon" part="icon">
                <sl-icon name=${this.iconName} size="md"></sl-icon>
              </slot>`}
          <div class="content-details">
            <slot name="title"></slot>
            <slot part="description"></slot>
            <slot name="details" part="details"></slot>
          </div>
        </div>
        ${this.dismissible
          ? html`
              <slot name="close-button" @click=${this.#closeOnAnimationend}>
                <sl-button
                  fill="ghost"
                  variant=${this.variant === 'info' ? 'primary' : this.variant}
                  size="sm"
                  aria-label=${msg('Close')}
                >
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              </slot>
            `
          : nothing}
      </div>
    `;
  }

  #closeOnAnimationend(event: AnimationEvent): void {
    if (event.animationName !== 'slide-in-up') {
      this.wrapper?.removeAttribute('open');
      this.wrapper?.addEventListener(
        'animationend',
        () => {
          this.remove();
        },
        { once: true }
      );

      requestAnimationFrame(() => {
        this.wrapper?.setAttribute('close', '');
      });
    }
  }
}
