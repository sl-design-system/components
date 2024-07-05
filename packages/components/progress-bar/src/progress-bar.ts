import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './progress-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-bar': ProgressBar;
  }
}

export type ProgressState = 'active' | 'success' | 'warning' | 'error';

/**
 * Progress bar component that can be used to communicate process status.
 * Hidden aria-live element will help making the progress bar more accessible and should cause fewer bugs in products than leaving it up for the developers.
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

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Progress value (from 0...100). */
  @property({ type: Number }) value = 0;

  /** Whether the progress bar has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Label describing the value of the progress bar. */
  @property() label?: string;

  /** The state of the progress bar. */
  @property({ reflect: true }) state: ProgressState = 'active';

  /** @internal The name of the icon, depending on the state. */
  get iconName(): string {
    switch (this.state) {
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

  override render(): TemplateResult {
    return html` ${this.label
        ? html`<span id="label" class="label">
            ${this.label}
            ${this.state !== 'active' ? html` <sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
          </span>`
        : nothing}
      <div
        aria-labelledby=${ifDefined(this.label ? 'label' : undefined)}
        aria-describedby="helper"
        class="container"
        role="progressbar"
        aria-busy=${ifDefined(this.indeterminate || this.state === 'active' ? true : undefined)}
        aria-valuemin="0"
        aria-valuenow=${ifDefined(!this.indeterminate ? `${this.value}` : undefined)}
        aria-valuemax="100"
      >
        <div class="progress" style="inline-size: ${this.value}%"></div>
      </div>
      <span id="helper" class="helper">
        <slot></slot>
        <span id="live" aria-live="polite">
          ${msg('state')} ${msg(this.state)}
          <!-- We want '%' to be read every time the value changes. -->
          <span aria-live="polite" aria-atomic="true">${this.value}%</span>
        </span>
        ${this.state !== 'active' && !this.label
          ? html` <sl-icon .name=${this.iconName} size="md"></sl-icon>`
          : nothing}
      </span>`;
  }
}
