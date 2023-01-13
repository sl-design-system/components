import type { CSSResultGroup, TemplateResult } from 'lit';
import type { EventEmitter } from '../utils/decorators/event.js';
import { LitElement, html } from 'lit';
import { event } from '../utils/decorators/event.js';
import styles from './tab-button.scss.js';

export class TabButton extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Emits when a specific tab is activated. */
  @event() tabActivate!: EventEmitter<boolean>;

  constructor() {
    super();
    this.addEventListener('click', () => this.#emitActiveTab());
  }
  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #emitActiveTab(): void {
    this.tabActivate.emit(true);
  }
}
