import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CopyButton } from '../copy-button/copy-button.js';
import styles from './code-example.css' with { type: 'css' };

export class CodeExample extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'doc-copy-button': CopyButton,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** Whether the demo background should use the inverted background color. */
  @property({ type: Boolean, reflect: true }) inverted?: boolean;

  /** The alignment of the content within the demo area. */
  @property() justify?: 'start' | 'center' | 'end' | 'stretch';

  /** Whether to show the source code by default (without requiring the user to expand it). */
  @property({ type: Boolean, reflect: true, attribute: 'show-source' }) showSource?: boolean;

  /** @internal The source code to be copied to the clipboard. */
  @state() source?: string;

  override render(): TemplateResult {
    const source = html`
      <div class="source">
        <slot @slotchange=${this.#onSlotChange} name="source"></slot>
        <doc-copy-button .content=${this.source}></doc-copy-button>
      </div>
    `;

    return html`
      <div class="demo">
        <slot></slot>
      </div>
      ${this.showSource
        ? source
        : html`
            <details>
              <summary>
                Code
                <sl-icon name="chevron-down"></sl-icon>
              </summary>
              ${source}
            </details>
          `}
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const pre = event.target
      .assignedElements({ flatten: true })
      .find((el): el is HTMLPreElement => el.tagName === 'PRE');

    this.source = pre?.textContent?.trim() ?? '';
  }
}
