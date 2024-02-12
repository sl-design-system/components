import type { CSSResultGroup, TemplateResult } from 'lit';
import type { PropertyValues } from 'lit/development';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { msg } from '@lit/localize';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { RovingTabindexController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { Tab } from './tab.js';
import { TabPanel } from './tab-panel.js';
import styles from './tab-group.scss.js';

export type TabsAlignment = 'start' | 'filled';

let nextUniqueId = 0;

/**
 * A tab group component that can contain tabs and tab panels.
 *
 * ```html
 *    <sl-tab-group>
 *         <sl-tab selected>First tab</sl-tab>
 *         <sl-tab-panel>Content of the tab 1</sl-tab-panel>
 *
 *         <sl-tab>Second tab</sl-tab>
 *         <sl-tab-panel>Content of the tab 2</sl-tab-panel>
 *    </sl-tab-group>
 * ```
 *
 * @slot default - a place for the tab group content.
 */
export class TabGroup extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
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
    elements: () => (isPopoverOpen(this.listbox) ? this.#allTabs : this.tabs) || [],
    isFocusableElement: (el: Tab) => !el.disabled
  });

  static #observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  };

  /** All slotted tabs. */
  #allTabs: Tab[] = [];

  /** Whether more button needs to be shown */
  #showMore = false;

  /** Button used to show all tabs */
  #moreButton!: HTMLButtonElement;

  /** Observe the tablist width. */
  #sizeObserver = new ResizeObserver(() => {
    this.#updateSelectionIndicator();
  });

  /** The slotted tabs. */
  @queryAssignedElements({ slot: 'tabs' }) tabs?: Tab[];

  /** The current tab node selected in the tab group. */
  @state() private selectedTab: Tab | null = this.#initialSelectedTab;

  /** The current tab node selected in the tab listbox (dropdown). */
  @state() private selectedTabInListbox: Tab | null = this.#initialSelectedTab;

  /** Emits when the tab has been selected/changed. */
  @event() tabChange!: EventEmitter<number>;

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  /** The alignment of tabs inside sl-tab-group  */
  @property({ reflect: true }) alignment: TabsAlignment = 'start';

  /** The listbox element with all tabs list. */
  @query('[popover]') listbox!: HTMLElement;

  /** Get the selected tab button, or the first tab button. */
  get #initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab:not([disabled])');
  }

  override render(): TemplateResult {
    this.#moreButton = this.renderRoot.querySelector('#more-btn') as HTMLButtonElement;
    this.#allTabs = Array.from(this.querySelectorAll('sl-tab'))?.map(tab => tab.cloneNode(true)) as Tab[];
    this.#allTabs.forEach(tab => tab.classList.add('listbox-tab'));

    return html`
      <div class="container" part="container" @keydown=${this.#handleKeydown}>
        <div class="wrapper" part="wrapper">
          <div @click=${this.#handleTabChange} role="tablist" part="tab-list">
            <span class="indicator" role="presentation"></span>
            <slot name="tabs" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
            <div
              id="tabs-popover"
              ${anchor({ element: this.#moreButton, position: this.vertical ? 'bottom-start' : 'bottom-end' })}
              @toggle=${this.#onToggle}
              popover
              role="listbox"
              @click=${this.#handleTabChange}
              part="listbox"
            >
              ${this.#allTabs}
            </div>
          </div>
        </div>
        ${this.#showMore
          ? html` <sl-button
              id="more-btn"
              @click=${this.#onClick}
              popovertarget="tabs-popover"
              fill="ghost"
              variant="primary"
              size="md"
              aria-controls="tabs-popover"
              aria-expanded="false"
              aria-haspopup="true"
              aria-label=${msg('Show all')}
            >
              <sl-icon name="ellipsis"></sl-icon>
            </sl-button>`
          : nothing}
      </div>
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#sizeObserver.observe(this);
    this.#updateSlots();
  }

  override disconnectedCallback(): void {
    this.#sizeObserver.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, TabGroup.#observerOptions);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('alignment') || changes.has('vertical')) {
      this.#updateSelectionIndicator();
    }
  }

  #updateSlots(): void {
    this.#setupTabs();
    this.#setupPanels();
  }

  #onClick(): void {
    this.listbox.togglePopover();
  }

  #onToggle = (event: ToggleEvent): void => {
    this.#rovingTabindexController.clearElementCache();

    requestAnimationFrame(() => {
      if (!this.listbox || !this.selectedTab) {
        return;
      }
      this.selectedTabInListbox = this.listbox.querySelector(`#${this.selectedTab.id}`) as Tab;
    });

    if (
      (event.newState === 'closed' && this.listbox.matches(':popover-open')) ||
      (event.newState === 'closed' && this.listbox.matches('.\\:popover-open')) ||
      event.newState === event.oldState
    ) {
      event.stopPropagation();
      this.listbox.hidePopover();
    }

    this.#moreButton?.setAttribute('aria-expanded', isPopoverOpen(this.listbox).toString());
  };

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

  #handleTabChange(event: Event & { target: HTMLElement }): void {
    /**
     * Return handler if it's not a tab
     */
    if (!(event.target.closest('sl-tab') instanceof Tab)) {
      return;
    }
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    this.#updateSelectedTab(event.target.closest<Tab>('sl-tab') as Tab);
    this.listbox.hidePopover();
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
      if (tab.id === selectedTab.id) {
        tab.setAttribute('selected', '');
        tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        this.selectedTab = tab;
      }
    });

    this.selectedTabInListbox = this.listbox?.querySelector(`#${selectedTab.id}`);

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
    if (isPopoverOpen(this.listbox)) {
      this.#rovingTabindexController.clearElementCache();
      this.#rovingTabindexController.hostContainsFocus();
    }

    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.scrollTo({ top: 0 });
      this.#updateSelectedTab(<Tab>event.target);

      if (isPopoverOpen(this.listbox)) {
        this.listbox.hidePopover();
      }
    }
  }

  #updateSelectionIndicator(): void {
    requestAnimationFrame(() => {
      if (!this.selectedTab || !this.selectedTabInListbox) {
        return;
      }

      if (!this.#showMore && isPopoverOpen(this.listbox)) {
        this.listbox.hidePopover();
      }

      const axis = this.vertical ? 'Y' : 'X',
        indicator = this.renderRoot.querySelector('.indicator') as HTMLElement,
        wrapper = this.renderRoot.querySelector('.container') as HTMLElement,
        tabsWrapper = this.renderRoot.querySelector('.wrapper') as HTMLElement,
        tablist = this.renderRoot.querySelector('[role="tablist"]') as HTMLElement,
        tabs = this.querySelectorAll('sl-tab');

      let totalTabsWidth = 0;
      let totalTabsHeight = 0;
      tabs.forEach(tab => {
        totalTabsWidth += tab.offsetWidth;
        totalTabsHeight += tab.offsetHeight;
      });

      this.#showMore = axis === 'X' ? totalTabsWidth > tabsWrapper.offsetWidth : totalTabsHeight > wrapper.offsetHeight;

      this.requestUpdate();

      let start = 0;
      if (axis === 'X') {
        start = this.selectedTab.getBoundingClientRect().left - tablist.getBoundingClientRect().left;
      } else {
        start = this.selectedTab.getBoundingClientRect().top - tablist.getBoundingClientRect().top;
      }

      // Somehow on Chromium, the offsetParent is different than on FF and Safari
      // If on Chromium, take the `wrapper.offsetLeft` into account as well
      if (this.selectedTab.offsetParent === wrapper) {
        start += axis === 'X' ? wrapper.offsetLeft : wrapper.offsetTop;
      }

      indicator.style.transform = `translate${axis}(${start}px)`;

      if (axis === 'X') {
        indicator.style.removeProperty('height');
        indicator.style.width = `${this.selectedTab.offsetWidth}px`;
        const scrollLeft = Math.max(
          this.selectedTab.offsetLeft + this.selectedTab.offsetWidth / 2 - tabsWrapper.clientWidth / 2,
          0
        );

        if (scrollLeft !== tabsWrapper.scrollLeft) {
          tabsWrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      } else {
        indicator.style.removeProperty('width');
        indicator.style.height = `${this.selectedTab.offsetHeight}px`;
      }
    });
  }
}
