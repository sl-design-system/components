import type { PropertyValues, TemplateResult } from 'lit';
// import type { Tab } from './tab.js';
// import type { TabButton } from './tab-button.js';
import type { TabButton } from './tab-button.js';
import type { Tab } from './tab.js';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { TabBar } from './tab-bar.js';
// import { TabBar } from './tab-bar.js';
// import styles from './tabs.scss.js';

export class Tabs extends LitElement {
  /** @private */
  // static override styles: CSSResultGroup = styles;

  static override styles = css`
    :host {
      --gap: 1rem;
      --padding: 2rem;
      height: 80px;
      background-color: lightblue;
    }

    :host {
      display: flex;
      gap: var(--gap);
    }

    :host {
      --gap: 0;
      flex-direction: column;
    }

    :host([orientation='vertical']) {
      --padding: 0;
    }

    ::slotted(dna-tab),
    ::slotted(dna-tab-bar) {
      padding-left: 12px;
      padding-right: 12px;
    }

    ::slotted(dna-tab) {
      grid-column: 1;
      grid-row: 1;
    }

    ::slotted(dna-tab-bar) {
      flex-shrink: 0;
    }

    .tabs {
      display: grid;
    }
  `;

  /** The selected tab; either the index or the id. */
  #selected: number | string = 0;

  /** The tab panels. */
  #tabs: Tab[] = [];

  /** The tab bar. */
  #tabBar?: TabBar;

  /** The selected tab index. */
  @property()
  get selected(): number | string {
    return this.#selected;
  }

  set selected(value: number | string) {
    const oldValue = this.#selected,
      selected = typeof value === 'number' ? value : parseInt(value);

    if (isNaN(selected)) {
      this.#selected = value;
    } else {
      this.#selected = selected;
    }
    this.requestUpdate('selected', oldValue);
  }

  get focusElement(): Tab {
    return this.#tabs.find(tab => tab.selected) ?? this.#tabs[0];
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // if (changes.has('orientation') && this.#tabBar) {
    //   this.#tabBar.orientation = this.orientation;
    // }

    if (changes.has('selected')) {
      const previous = this.#tabs.find(tab => tab.selected);
      if (previous) {
        previous.selected = false;
      }
      const next =
        typeof this.selected === 'number'
          ? this.#tabs[this.selected || 0]
          : this.#tabs.find(tab => tab.id === this.selected.toString());
      if (next) {
        next.selected = true;
      }
      if (this.#tabBar) {
        this.#updateTabBarSelection();
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onTabBarSlotchange} @tabActivate=${this.#onTabActivate} name="tab-bar"></slot>
      <div class="tabs">
        <slot @slotchange=${this.#onSlotchange} name="tab"></slot>
      </div>
    `;
  }
  // @tabActivate=${this.#onTabActivate}

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    this.#tabs = target.assignedElements() as Tab[];

    const buttons: TabButton[] = Array.from(this.querySelectorAll('dna-tab-button'));

    this.#tabs.map((tab, index) => {
      const button = buttons[index];
      if (button) {
        button.setAttribute('aria-controls', tab.id);
        tab.setAttribute('aria-labelledby', button.id);
      }
      tab.selected = false;
      if (button?.selected) {
        tab.selected = true;
      } else {
        tab.selected = this.#isTabSelected(tab);
      }
    });

    this.#updateTabBarSelection();
  }

  #onTabActivate(event: Event & { target: TabButton }): void {
    const buttons = Array.from(this.querySelectorAll('dna-tab-button'));

    this.selected = buttons.findIndex(button => button === event.target);
  }

  #onTabBarSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    if (elements.length && elements[0] instanceof TabBar) {
      this.#tabBar = elements[0];
      if (this.selected !== -1 && this.#tabBar.selected !== this.selected) {
        this.#updateTabBarSelection();
      }
      // if (this.orientation && this.#tabBar.orientation !== this.orientation) {
      //   this.#tabBar.orientation = this.orientation;
      // }
    }
  }

  #isTabSelected(tab: Tab): boolean {
    if (typeof this.selected === 'string') {
      return tab.id === this.selected;
    } else {
      return this.#tabs.indexOf(tab) === this.selected;
    }
  }

  #updateTabBarSelection(): void {
    // if (!this.#tabBar || !this.selected) {
    //   return;
    // }

    if (typeof this.selected === 'string') {
      const index = this.#tabs.findIndex(tab => tab.id === this.selected);

      this.#tabBar.selected = index;
    } else {
      this.#tabBar.selected = this.selected;
    }
  }
}
