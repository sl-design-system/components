import { type CSSResultGroup, LitElement, ReactiveElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './progress-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-bar': ProgressBar;
  }
}

// export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';

export type ProgressStatus = 'active' | 'success' | 'warning' | 'error';

/**
 * Progress bar component...
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <sl-button-bar>
 *   <sl-button>Foo</sl-button>
 *   <sl-button>Bar</sl-button>
 * </sl-button-bar>
 * ```
 *
 * @cssprop --sl-button-bar-align - The alignment of the buttons within the bar. Possible values: `start`, `center`, `end`, `space-between`. By default it is `start`. You can use it eg. for mobile version (together with `--sl-button-bar-direction-row`).
 * @cssprop --sl-button-bar-direction - The flex direction of the button container.
 * @cssprop --sl-button-bar-vertical - Vertical (column) direction - you can set <code>--sl-ON</code> or <code>`--sl-OFF`</code> when needed (eg. only for mobile version); by default it is OFF.
 *          Some more information can be found in the <a href="https://lea.verou.me/blog/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/" target="_blank">article about using multiple values with one custom property</a>.
 * @slot default - Buttons to be grouped in the bar.
 */
export class ProgressBar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  // /** The alignment of the buttons within the bar. */
  // @property({ reflect: true }) align?: ButtonBarAlign;


  // TODO: indeterminate, animate, 3 sizes sm/md/lg, variants primary (default), success, danger?
  // TODO: percentage and label on the top or on the botton of the progress bar

  /** Progress value (from 0...100). */
  @property({ type: Number }) value = 20; // TODO: should default to 0;

  /** Whether the progress bar has the indeterminate state. */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Label describing the value of the progress bar. */
  @property() label?: string;

  /** Helper text describing more the progress bar. */
  @property({attribute: 'helper-text'}) helperText?: string;

  /** The status of the progress bar. */
  @property({ reflect: true }) status?: ProgressStatus = 'active';

  // @property({ attribute: 'inline', reflect: true }) inline?: boolean;

  override render(): TemplateResult {
    return html`
      <span class="label">${this.label}</span>
      <div class="container">
        <div class="progress" style="inline-size: ${this.value}%">${this.value}%</div>
      </div>
      <span class="helper">Optional helper text</span><h2>${this.value}%</h2>`;
  } // TODO: do we need any slot?

  // async #onSlotchange(event: Event & { target: HTMLSlotElement }): Promise<void> {
  //   const assignedElements = event.target.assignedElements({ flatten: true });
  //
  //   const icons = await Promise.all(
  //     assignedElements.map(async el => {
  //       if (el instanceof ReactiveElement) {
  //         await el.updateComplete;
  //       }
  //
  //       return el.hasAttribute('icon-only') && el.getAttribute('fill') === 'ghost';
  //     })
  //   );
  //
  //   this.iconOnly = icons.every(Boolean);
  // }
}
