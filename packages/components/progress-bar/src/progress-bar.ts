import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { sendToLiveAria } from '@sl-design-system/notification';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './progress-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-bar': ProgressBar;
  }
}

export type ProgressVariant = 'success' | 'warning' | 'error';

/**
 * Progress bar component that can be used to communicate process status.
 * Hidden `aria-live` element makes the progress bar more accessible, so developers don’t need to worry about adding it manually.
 *
 *
 * ```html
 *  <sl-progress-bar label="Downloading file">
 *     <span>40% of 100%</span>
 *  </sl-button-bar>
 * ```
 *
 * @slot default - A place for helper text like e.g. `20% of 100%`.
 */
@localized()
export class ProgressBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the progress bar has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Label describing the value of the progress bar. */
  @property() label?: string;

  /** The variant of the progress bar. */
  @property({ reflect: true }) variant?: ProgressVariant;

  /** Progress value (from 0...100). */
  @property({ type: Number }) value = 0;

  private shouldSendToLiveAria = true;

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'octagon-exclamation-solid';
      case 'error':
        return 'triangle-exclamation-solid';
      default:
        return 'circle-check-solid';
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      if (this.value === 100) {
        sendToLiveAria(`${msg('success')}`);
      }
      if (this.shouldSendToLiveAria) {
        sendToLiveAria(`${this.value}%`);
        this.shouldSendToLiveAria = false;
        setTimeout(() => {
          this.shouldSendToLiveAria = true;
        }, 1500);
      }
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.label
        ? html`
            <div id="label" class="label">
              ${this.label} ${this.variant ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
            </div>
          `
        : nothing}
      <div
        aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
        aria-describedby="helper"
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuenow=${ifDefined(!this.indeterminate ? `${this.value}` : undefined)}
        aria-valuemax="100"
      >
        <div
          class="progress"
          style=${styleMap({ transform: !this.indeterminate || this.variant ? `scaleX(${this.value / 100})` : '' })}
        ></div>
      </div>
      <div id="helper" class="helper">
        <slot></slot>
        <span id="live" aria-busy=${ifDefined(this.indeterminate)}>
          ${msg('state')} ${this.variant ? html`${this.#getLocalizedVariant()}` : html`${msg('active')}`} ${this.value}%
        </span>
        ${this.variant && !this.label ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
      </div>
    `;
  }

  #getLocalizedVariant(): TemplateResult {
    switch (this.variant) {
      case 'success':
        return html`${msg('success')}`;
      case 'warning':
        return html`${msg('warning')}`;
      case 'error':
        return html`${msg('error')}`;
      default:
        return html`${msg('success')}`;
    }
  }
}
