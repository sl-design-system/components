import type { CSSResultGroup, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { RovingTabindexController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { Tab } from './tab.js';
import { TabPanel } from './tab-panel.js';
import styles from './tab-group.scss.js';

let nextUniqueId = 0;

export class TabGroup extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tab': Tab,
      'sl-tab-panel': TabPanel
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * Unique ID for each tab group component present.
   */
  #tabGroupId = `sl-tab-group-${nextUniqueId++}`;

  #observer?: MutationObserver;

  #rovingTabindexController = new RovingTabindexController<Tab>(this, {
    focusInIndex: (elements: Tab[]) => elements.findIndex(el => el.selected),
    elements: () => this.tabs || [],
    isFocusableElement: (el: Tab) => !el.disabled
  });

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  };

  /** The slotted tabs. */
  @queryAssignedElements({ slot: 'tabs' }) tabs?: Tab[];

  /** The current tab node selected in the tab group. */
  @state() private selectedTab: Tab | null = this.#initialSelectedTab;

  @event() tabChange!: EventEmitter<number>;

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ reflect: true }) vertical = false;

  /** Get the selected tab button, or the first tab button. */
  get #initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab:not([disabled])');
  }

  override render(): TemplateResult {
    return html`
      <div @click=${this.#handleTabChange} role="tablist" @keydown=${this.#handleKeydown} part="tab-list">
        <span class="indicator" role="presentation"></span>
        <slot name="tabs" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </div>
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#updateSlots();
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, TabGroup.#observerOptions);
    setTimeout(() => this.#updateSelectionIndicator(), 100);
  }

  #updateSlots(): void {
    this.#setupTabs();
    this.#setupPanels();
  }

  /**
   * If the selected tab is selected programmatically update all the tabs.
   */
  #handleMutation = (mutations: MutationRecord[]): void => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'selected' && mutation.oldValue === null) {
        const selectedTab = <Tab>mutation.target;
        this.#observer?.disconnect();
        this.#updateSelectedTab(selectedTab);
        this.#observer?.observe(this, TabGroup.#observerOptions);
      }
    });
  };

  /**
   * Apply accessible attributes and values to the tab buttons.
   */
  #setupTabs(): void {
    const tabs = this.querySelectorAll('sl-tab');

    tabs.forEach((tab, index) => {
      tab.setAttribute('id', `${this.#tabGroupId}-tab-${index + 1}`);
      tab.setAttribute('aria-controls', `${this.#tabGroupId}-panel-${index + 1}`);
      tab.toggleAttribute('selected', tab === this.selectedTab);
    });
  }

  /**
   * Apply accessible attributes and values to the tab panels.
   */
  #setupPanels(): void {
    const panels = this.querySelectorAll('sl-tab-panel');
    const selectedPanelId = this.selectedTab?.getAttribute('aria-controls');
    const tabIndex = this.selectedTab ? Array.from(this.querySelectorAll('sl-tab')).indexOf(this.selectedTab) : 0;

    if (panels.length === 1) {
      panels[0].setAttribute('id', `${this.#tabGroupId}-panel-${tabIndex + 1}`);
      panels[0].setAttribute('aria-labelledby', `${this.#tabGroupId}-tab-${tabIndex + 1}`);
      panels[0].setAttribute('aria-hidden', 'false');
    } else {
      panels.forEach((panel, index) => {
        panel.setAttribute('id', `${this.#tabGroupId}-panel-${index + 1}`);
        panel.setAttribute('aria-labelledby', `${this.#tabGroupId}-tab-${index + 1}`);
        panel.setAttribute('aria-hidden', `${panel.getAttribute('id') !== selectedPanelId ? 'true' : 'false'}`);
      });
    }
  }

  #handleTabChange(event: Event): void {
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not a tab or if it's already selected
     */
    if (!(event.target instanceof Tab)) return;
    this.#updateSelectedTab(event.target);
  }

  /**
   * Update the selected tab button with attributes and values.
   * Update the tab group state.
   */
  #updateSelectedTab(selectedTab: Tab): void {
    const controls = selectedTab.getAttribute('aria-controls');

    if (selectedTab === this.selectedTab || !controls || selectedTab.disabled) return;

    const selectedPanel = this.querySelector(`#${controls}`);
    const tabIndex = Array.from(this.querySelectorAll('sl-tab')).indexOf(selectedTab);

    /**
     * Reset all the selected state of the tabs, and select the clicked tab
     */
    this.querySelectorAll<Tab>('sl-tab').forEach((tab: Tab) => {
      tab.removeAttribute('selected');
      if (tab === selectedTab) {
        tab.setAttribute('selected', '');
        tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        this.selectedTab = tab;
      }
    });

    /**
     * Reset all the visibility of the panels,
     * and show the panel related to the selected tab
     */
    const panels = this.querySelectorAll('sl-tab-panel');

    if (panels.length === 1) {
      panels[0].setAttribute('id', `${this.#tabGroupId}-panel-${tabIndex + 1}`);
      panels[0].setAttribute('aria-labelledby', `${this.#tabGroupId}-tab-${tabIndex + 1}`);
    } else {
      panels.forEach(panel => {
        panel.setAttribute('aria-hidden', `${panel !== selectedPanel ? 'true' : 'false'}`);
      });
    }

    this.tabChange.emit(tabIndex);

    this.#updateSelectionIndicator();
  }

  /**
   * Handle keyboard accessible controls.
   */
  #handleKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.scrollTo({ top: 0 });
      this.#updateSelectedTab(<Tab>event.target);
    }
  }

  #updateSelectionIndicator(): void {
    if (!this.selectedTab) {
      return;
    }

    const axis = this.vertical ? 'Y' : 'X',
      indicator = this.shadowRoot?.querySelector('.indicator') as HTMLElement,
      wrapper = this.shadowRoot?.querySelector('[role="tablist"]') as HTMLElement;

    let start = 0;
    if (axis === 'X') {
      start = this.selectedTab.offsetLeft - wrapper.offsetLeft;
    } else {
      start = this.selectedTab.offsetTop - wrapper.offsetTop;
    }

    // Somehow on Chromium, the offsetParent is different than on FF and Safari
    // If on Chromium, take the `wrapper.offsetLeft` into account as well
    if (this.selectedTab.offsetParent === wrapper) {
      start += axis === 'X' ? wrapper.offsetLeft : wrapper.offsetTop;
    }

    indicator.style.transform = `translate${axis}(${start}px) scale${axis}(${
      axis === 'X' ? this.selectedTab.offsetWidth : this.selectedTab.offsetHeight
    })`;

    if (axis === 'X') {
      const scrollLeft = Math.max(
        this.selectedTab.offsetLeft + this.selectedTab.offsetWidth / 2 - wrapper.clientWidth / 2,
        0
      );

      if (scrollLeft !== wrapper.scrollLeft) {
        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }
}
