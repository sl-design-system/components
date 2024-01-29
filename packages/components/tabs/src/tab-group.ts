import type { CSSResultGroup, TemplateResult } from 'lit';
import type { PropertyValues } from 'lit/development';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { RovingTabindexController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { Tab } from './tab.js';
import { TabPanel } from './tab-panel.js';
import styles from './tab-group.scss.js';

export type TabsAlignment = 'left' | 'filled';

let nextUniqueId = 0;

// TODO: add docs here like with default slots etc.

// @localized()
/**
 * A tab group component with tabs and tab panels.
 *
 * @slot default - A place for the tab group content.
 * @slot tabs - A place for tabs components.
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
    elements: () =>
      (isPopoverOpen(this.listbox) ? Array.from(this.listbox?.querySelectorAll(`sl-tab`)) : this.tabs) || [],
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

  /** The current tab node selected in the tab group. */
  @state() private selectedTabInListbox: Tab | null = this.#initialSelectedTab;

  @event() tabChange!: EventEmitter<number>;

  /** The slotted tabs. */
  #allTabs: Tab[] | null = [];

  /** Whether more button needs to be shown */
  #showMore = false;

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ reflect: true }) vertical = false;

  /** The alignemnt of tabs inside sl-tab-group  */
  @property({ reflect: true }) alignment: TabsAlignment = 'left';

  /** Observe the tablist width. */
  #sizeObserver = new ResizeObserver(() => {
    // Workaround for "ResizeObserver loop completed with undelivered notifications."
    requestAnimationFrame(() => this.#updateSelectionIndicator());
  });

  /** @private */
  moreButton!: HTMLButtonElement;

  /** The listbox element with all tabs list. */
  @query('[popover]') listbox!: HTMLElement;

  /** Get the selected tab button, or the first tab button. */
  get #initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab:not([disabled])');
  }

  // override willUpdate(changes: PropertyValues<this>): void {
  //   super.willUpdate(changes);
  //
  //   const clonedTabs = Array.from(this.querySelectorAll('sl-tab'))?.map(tab => tab.cloneNode(true));
  //
  //
  //   console.log('changes', changes, clonedTabs);
  //   this.moreButton = this.shadowRoot?.querySelector('sl-button') as HTMLButtonElement;
  // }

  override render(): TemplateResult {
    // TODO: no moreButton??
    this.moreButton = this.shadowRoot?.querySelector('#more-btn') as HTMLButtonElement;
    this.#allTabs = Array.from(this.querySelectorAll('sl-tab'))?.map(tab => tab.cloneNode(true)) as Tab[];

    return html`
      <div class="container" part="container" @keydown=${this.#handleKeydown}>
        <div class="wrapper" part="wrapper">
          <div @click=${this.#handleTabChange} role="tablist" part="tab-list">
            <span class="indicator" role="presentation"></span>
            <slot name="tabs" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
            <div
              id="tabs-popover"
              ${anchor({ element: this.moreButton, position: this.vertical ? 'bottom-start' : 'bottom-end' })}
              @toggle=${this.#onToggle}
              popover
              role="listbox"
              @click=${this.#handleTabChange}
            >
              ${this.#allTabs}
              <span class="indicator-listbox" role="presentation"></span>
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
            >
              <sl-icon name="ellipsis"></sl-icon>
            </sl-button>`
          : nothing}
      </div>
      <slot></slot>
    `;
  } // TODO: aria-label=${msg('Close')} -> msg 'open' or 'more'
  // TODO: msg Show all tabs

  override connectedCallback(): void {
    this.#sizeObserver.observe(this);
    super.connectedCallback();
    this.#updateSlots();
  }

  override firstUpdated(): void {
    console.log('firstUpdated', this.selectedTab);
    // TODO: maybe morebutton here in the first updated and anchor element?
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, TabGroup.#observerOptions);
    this.#allTabs = Array.from(this.querySelectorAll('sl-tab'));
    this.listbox.classList.add('anchor');
    // TODO: updateindicator after all slotted element rendered?
    setTimeout(() => this.#updateSelectionIndicator(), 700);
  }

  override disconnectedCallback(): void {
    this.#sizeObserver.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('alignment') || changes.has('vertical')) {
      requestAnimationFrame(() => {
        this.#updateSelectionIndicator();
      });
    }
  }

  #updateSlots(): void {
    this.#setupTabs();
    this.#setupPanels();
  }

  #onClick(): void {
    this.listbox.togglePopover();
  }

  // TODO: on changed probably or will change set indicator, because there is a problem with indicator when switching between vertical and horizontal tabs

  #onToggle = (event: Event): void => {
    const indicatorListbox = this.shadowRoot?.querySelector('.indicator-listbox') as HTMLElement;

    if (!this.listbox || !this.selectedTab) {
      return;
    }

    this.#rovingTabindexController.clearElementCache(); // TODO: maybe sth with manageIndexesAnimationFrame ?????

    requestAnimationFrame(() => {
      // this.#rovingTabindexController.clearElementCache();

      if (!this.listbox || !this.selectedTab) {
        return;
      }
      this.selectedTabInListbox = this.listbox.querySelector(`#${this.selectedTab.id}`) as Tab;
      // indicatorListbox.style.transform = `translateY(${this.selectedTabInListbox?.offsetTop}px) scaleY(${this.selectedTabInListbox.offsetHeight})`;
      indicatorListbox.style.transform = `translateY(${this.selectedTabInListbox?.offsetTop}px)`;
      indicatorListbox.style.height = `${this.selectedTabInListbox.offsetHeight}px`;
    });

    // indicatorListbox.style.transform = `translateY(${this.selectedTabInListbox?.offsetTop}px) scaleY(${this.selectedTabInListbox.offsetHeight})`;

    if (
      ((event as ToggleEvent).newState === 'closed' && (event.target as HTMLElement).matches(':popover-open')) ||
      (event as ToggleEvent).newState === (event as ToggleEvent).oldState
    ) {
      event.stopPropagation();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (event.target as HTMLElement)?.hidePopover();
    }
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

  // TODO: add keyboard navigation to the dropdown menu

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
    if (!((event.target as HTMLElement).closest('sl-tab') instanceof Tab)) {
      return;
    }
    // event.preventDefault();
    // event.stopPropagation();
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not a tab or if it's already selected
     */
    // if (!(event.target as HTMLElement).closest('sl-tab') /*(event.target instanceof Tab)*/) return;
    this.#updateSelectedTab((event.target as HTMLElement).closest('sl-tab') as Tab /*event.target*/); // TODO: this may cause a problem?
    this.listbox.hidePopover();
  }

  /**
   * Update the selected tab button with attributes and values.
   * Update the tab group state.
   */
  #updateSelectedTab(selectedTab: Tab): void {
    const controls = selectedTab.getAttribute('aria-controls');

    if (/*selectedTab === this.selectedTab ||*/ !controls || selectedTab.disabled) return;

    const selectedPanel = this.querySelector(`#${controls}`);
    const tabIndex = Array.from(this.querySelectorAll('sl-tab')).indexOf(selectedTab);

    /**
     * Reset all the selected state of the tabs, and select the clicked tab
     */
    this.querySelectorAll<Tab>('sl-tab').forEach((tab: Tab) => {
      tab.removeAttribute('selected');
      console.log('tab === selectedTab', tab === selectedTab, tab, selectedTab);
      if (tab.id === selectedTab.id) {
        tab.setAttribute('selected', '');
        tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        this.selectedTab = tab;
        // this.selectedTabInListbox = (this.#allTabs as Tab[])?.find(tabEl => tabEl.id === selectedTab.id);
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

      const axis = this.vertical ? 'Y' : 'X',
        indicator = this.shadowRoot?.querySelector('.indicator') as HTMLElement,
        indicatorListbox = this.shadowRoot?.querySelector('.indicator-listbox') as HTMLElement,
        wrapper = this.shadowRoot?.querySelector('.container') as HTMLElement,
        wrapper2 = this.shadowRoot?.querySelectorAll('[slot="tabs"]'),
        wrapper3 = this.shadowRoot?.querySelectorAll('sl-tab'),
        wrapper4 = this.querySelectorAll('sl-tab');

      // wrapper = this.shadowRoot?.querySelector('.wrapper') as HTMLElement,

      // wrapper = this.shadowRoot?.querySelector('[role="tablist"]') as HTMLElement,

      wrapper2?.forEach(tab => console.log('wrapper2 width', tab, (tab as HTMLElement).offsetWidth, tab.scrollWidth));

      wrapper3?.forEach(tab => console.log('wrapper3 width', tab, (tab as HTMLElement).offsetWidth, tab.scrollWidth));

      wrapper4?.forEach(tab => console.log('wrapper4 width', tab, (tab as HTMLElement).offsetWidth, tab.scrollWidth));

      wrapper4?.forEach(tab => console.log('wrapper4 width', tab, (tab as HTMLElement).offsetWidth, tab.scrollWidth));

      let totalTabsWidth = 0;
      let totalTabsHeight = 0;
      wrapper4.forEach(tab => {
        console.log('tab.offsetWidth, tab.offsetHeight', tab.offsetWidth, tab.offsetHeight);
        totalTabsWidth = totalTabsWidth + tab.offsetWidth;
        totalTabsHeight = totalTabsHeight + tab.offsetHeight;
      });

      // this.#showMore =
      //   totalTabsWidth >
      //   (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetWidth /*wrapper.offsetWidth*/; // TODO: to refactor

      if (axis === 'X') {
        this.#showMore =
          totalTabsWidth >
          (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetWidth /*wrapper.offsetWidth*/;
      } else {
        this.#showMore = totalTabsHeight > (this.shadowRoot?.querySelector('.container') as HTMLElement).offsetHeight;
        // totalTabsHeight >
        // (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetHeight /*wrapper.offsetWidth*/;
      }

      console.log(
        'totalWidth',
        totalTabsWidth,
        wrapper4,
        wrapper.offsetWidth,
        wrapper.scrollWidth,
        this.#showMore,
        (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetWidth,
        totalTabsHeight,
        (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetHeight,
        (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).scrollHeight,
        this.parentElement,
        this.parentElement?.offsetHeight,
        totalTabsHeight > (this.shadowRoot?.querySelector('.wrapper') as HTMLElement).offsetHeight,
        totalTabsHeight > (this.shadowRoot?.querySelector('.container') as HTMLElement).offsetHeight
      );

      this.requestUpdate(); // TODO: causes some problems? but necessary to render more button on resize

      const wrapper5 = this.shadowRoot?.querySelector('[role="tablist"]') as HTMLElement;

      let start = 0;
      if (axis === 'X') {
        start = this.selectedTab.offsetLeft - wrapper.offsetLeft - wrapper5.offsetLeft;
      } else {
        start = this.selectedTab.offsetTop - wrapper.offsetTop - wrapper5.offsetTop;
      }

      // Somehow on Chromium, the offsetParent is different than on FF and Safari
      // If on Chromium, take the `wrapper.offsetLeft` into account as well
      if (this.selectedTab.offsetParent === wrapper) {
        start += axis === 'X' ? wrapper.offsetLeft : wrapper.offsetTop;
      }

      indicator.style.transform = `translate${axis}(${start}px)`;

      indicatorListbox.style.transform = `translateY(${
        this.selectedTabInListbox.offsetTop + this.listbox.offsetHeight
      }px) scaleY(${this.selectedTabInListbox.offsetHeight})`;

      if (axis === 'X') {
        indicator.style.removeProperty('height');
        indicator.style.width = `${this.selectedTab.offsetWidth}px`;
        const scrollLeft = Math.max(
          this.selectedTab.offsetLeft + this.selectedTab.offsetWidth / 2 - wrapper.clientWidth / 2,
          0
        );

        if (scrollLeft !== wrapper.scrollLeft) {
          wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          // this.listbox.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      } else {
        indicator.style.removeProperty('width');
        indicator.style.height = `${this.selectedTab.offsetHeight}px`;
        // TODO: restart idicator when vertical/horizontal changed, remove width or height
      }
    });
  }
}
