import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Icon } from '@sl-design-system/icon';
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
export type ProgressColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow';

/**
 * Progress bar component that can be used to communicate process status.
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

  /** The color of the progress bar. */
  @property({ reflect: true }) color?: ProgressColor;

  /** Progress value (from 0...100). */
  @property({ type: Number }) value = 0;

  private shouldAnnounce = true;

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
        announce(`100%, ${this.#getLocalizedVariant().strings[0]}`);
      }
      if (this.shouldAnnounce) {
        announce(`${this.value}%`, 'assertive');
        this.shouldAnnounce = false;
        setTimeout(() => {
          this.shouldAnnounce = true;
        }, 1500);
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div>
        ${this.label
          ? html`
              <div id="label" class="label">
                ${this.label} ${this.variant ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
              </div>
            `
          : nothing}
        <div id="helper" class="helper">
          <slot></slot>
          <span id="live" aria-busy=${ifDefined(this.indeterminate)}>
            ${msg('state', { id: 'sl.progressBar.state' })}:
            ${this.variant
              ? html`${this.#getLocalizedVariant()}`
              : html`${msg('active', { id: 'sl.progressBar.active' })}`}
          </span>
          ${this.variant && !this.label ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
        </div>
      </div>
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
          style=${styleMap({ width: !this.indeterminate || this.variant ? `${this.value}%` : '' })}
        ></div>
      </div>
      <slot name="error"></slot>
    `;
  }

  #getLocalizedVariant(): TemplateResult {
    switch (this.variant) {
      case 'success':
        return html`${msg('success', { id: 'sl.progressBar.success' })}`;
      case 'warning':
        return html`${msg('warning', { id: 'sl.progressBar.warning' })}`;
      case 'error':
        return html`${msg('error', { id: 'sl.progressBar.error' })}`;
      default:
        return html`${msg('success', { id: 'sl.progressBar.success' })}`;
    }
  }
}
