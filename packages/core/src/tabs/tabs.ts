import type { CSSResultGroup, TemplateResult } from 'lit';
import type { TabBarSelectedEvent } from './tab-bar.js';
import type { Tab } from './tab.js';
import { LitElement, html } from 'lit';
import { EventsController } from '../utils/controllers/index.js';
import styles from './tabs.scss.js';

export class Tabs extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this);
  /** The tab panels. */
  #tabs: Tab[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'sl-tab-bar-selected', this.#onTabBarSelected);
  }

  override render(): TemplateResult {
    return html`<slot name="tab-bar"></slot>
      <slot @slotchange=${this.onSlotchange}></slot> `;
  }

  onSlotchange(): void {
    this.#tabs = Array.from(this.querySelectorAll('sl-tab'));
  }

  #onTabBarSelected(event: TabBarSelectedEvent<number>): void {
    this.#tabs.forEach(element => element.removeAttribute('selected'));

    this.#tabs[event.item].setAttribute('selected', 'true');
  }
}
