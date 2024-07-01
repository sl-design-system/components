import {type CSSResultGroup, LitElement, ReactiveElement, type TemplateResult, html, nothing} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './progress-bar.scss.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import {Icon} from "@sl-design-system/icon";

declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-bar': ProgressBar;
  }
}

// export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';

export type ProgressState = 'active' | 'success' | 'warning' | 'error';

/**
 * Progress bar component...
 * slot default a place for helper text like `20% of 100%`
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <sl-progress-bar label="Downloading file">
 *   <span>40% of 100%</span>
 * </sl-button-bar>
 * ```
 *
 * @slot default - A place for helper text like `20% of 100%`.
 */
export class ProgressBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;


  // TODO: indeterminate, animate, 3 sizes sm/md/lg, variants primary (default), success, danger?

  /** Progress value (from 0...100). */
  @property({ type: Number }) value = 20; // TODO: should default to 0;

  /** Whether the progress bar has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Label describing the value of the progress bar. */
  @property() label?: string;

  /** The state of the progress bar. */
  @property({ reflect: true }) state?: ProgressState = 'active';

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
        return 'info';
    }
  }

  // TODO:  warning octagon-exclamation-solid
  // TODO: error triangle-exclamation-solid
  // TODO: when there is no label applied, aria-label needs to be applied

  override render(): TemplateResult {
    return html`
      ${this.label ?
        html`<span id="label" class="label">
          ${this.label}
          ${this.state !== 'active' ?
            html`<sl-icon .name=${this.iconName} size="md" ></sl-icon>`
            : nothing
          }
        </span>`
        : nothing
      }
      <div aria-labelledby="label"
           aria-describedby="helper"
           class="container"
           role="progressbar"
           aria-valuemin="0"
           .aria-valuenow=${this.value}
           aria-valuemax="100">
        <div class="progress" style="inline-size: ${this.value}%"></div>
      </div>
      <span id="helper" class="helper">
        <slot></slot>
        ${this.state !== 'active' && !this.label ?
          html`<sl-icon .name=${this.iconName} size="md" ></sl-icon>`
          : nothing
        }
      </span>`;
  } // TODO: do we need any slot?
}
// TODO: what about state success warning and error and a11y???
// <span class="helper">Optional helper text</span>

// TODO: aria-label when there is no label?
// TODO: role=progressbar?
// aria-valuemin="0"
// aria-valuenow="50"
// aria-valuemax="100"

// TODO: dependencies!!

// TODO: aria-describedby and aria-labelledby?

// TODO: use slotchange to detect whether helper text is slotted and if not don't show any icon there
