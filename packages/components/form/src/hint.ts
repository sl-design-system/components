import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './hint.scss.js';

export type HintSize = 'sm' | 'md' | 'lg';

/**
 * Component for displaying a hint for a form control.
 *
 * @slot hint-text - The hint to display.
 */
export class Hint extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The size at which the hint is displayed. */
  @property({ reflect: true }) size: HintSize = 'md';

  constructor() {
    super();

    const slot = document.createElement('slot');
    slot.name = 'hint-text';

    this.append(slot);
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true });

    this.toggleAttribute('hidden', assignedElements.length === 0);
  }
}
