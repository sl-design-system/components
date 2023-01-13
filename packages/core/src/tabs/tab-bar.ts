import type { CSSResultGroup, TemplateResult } from 'lit';
import type { TabButton } from './tab-button.js';
import type { EventEmitter } from '../utils/decorators/event.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { event } from '../utils/decorators/event.js';
import { EventsController } from '../utils/controllers/events.js';
import styles from './tab-bar.scss.js';

export class TabBarSelectedEvent<T> extends Event {
  constructor(public readonly item: T, public readonly relatedEvent: Event | null) {
    super('sl-tab-bar-selected', { bubbles: true, composed: true });
  }
}

export class TabBar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this);

  /** Slotted tab buttons. */
  #tabButtons: TabButton[] = [];

  /** Emits when a specific tab is activated. */
  @event() tabBarSelected!: EventEmitter<TabBarSelectedEvent<number>>;

  /** The selected tab index. */
  @property({ type: Number }) selected = -1;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'sl-tab-activate', this.#onTabActivate);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotchange}></slot> `;
  }

  onSlotchange(): void {
    this.#tabButtons = Array.from(this.querySelectorAll('sl-tab-button'));
  }

  #onTabActivate(event: Event): void {
    this.selected = this.#tabButtons.findIndex(button => button === event.target);
    this.tabBarSelected.emit(new TabBarSelectedEvent(this.selected, event));
  }
}
