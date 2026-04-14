import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './code-example.css' with { type: 'css' };

export class CodeExample extends LitElement {
  /** @internal */
  static styles: CSSResultGroup = styles;

  /** @internal */
  #internals = this.attachInternals();

  /** The alignment of the content within the demo area. */
  @property() align?: 'start' | 'center' | 'end' | 'fill';

  override render(): TemplateResult {
    return html`
      <div class="demo">
        <slot></slot>
      </div>
      <div class="source">
        <slot name="source"></slot>
      </div>
    `;
  }

  updated(changes: PropertyValues<this>): void {
    // Remove old value
    if (changes.get('align')) {
      this.#internals.states.delete(`align-${changes.get('align')}`);
    }

    // Add new value
    if (this.align) {
      this.#internals.states.add(`align-${this.align}`);
    }
  }
}
