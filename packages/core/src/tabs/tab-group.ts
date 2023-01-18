import type { CSSResultGroup, TemplateResult } from 'lit';
import type { EventEmitter } from '../utils/decorators/event.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { event } from '../utils/decorators/event.js';
import { Tab } from './tab.js';
import styles from './tab-group.scss.js';

let tabGroupCount = 0;

export class TabGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * Unique ID for each tab group component present.
   */
  private tabGroupId = `sl-tab-group-${tabGroupCount++}`;

  private observer?: MutationObserver;

  private static observerOptions = {
    attributes: true,
    subtree: true,
    attributeFilter: ['selected'],
    attributeOldValue: true
  };

  /** Whether the selection indicator should animate on the next run. */
  #shouldAnimate = false;

  /**
   * The current tab node selected in the tab group.
   */
  @state() private selectedTab: Tab | null = this.initialSelectedTab;

  @event() tabChange!: EventEmitter<number>;

  @property({ reflect: true }) vertical = false;

  /**
   * Get the selected tab button, or the first tab button.
   */
  private get initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab');
  }

  override render(): TemplateResult {
    return html`<div @click=${this.handleTabChange} role="tablist" @keydown=${this.handleKeydown} part="tab-list">
        <span class="indicator" role="presentation"></span>
        <slot name="tabs"></slot>
      </div>
      <slot></slot>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateSlots();

    /**
     * We use an IntersectionObserver to get notified when the tab-bar becomes visible.
     * When the tab-bar is initially invisible, the tab indicator size cannot be calculated
     * because the tab buttons have 0 width & height. So when the tab-bar becomes visible,
     * recalculate the tab indicator position & size.
     */
    // this.#observer = new IntersectionObserver(() => this.#updateSelectionIndicator());
    // this.#observer.observe(this);
  }

  private updateSlots(): void {
    this.setupTabs();
    this.setupPanels();
  }

  override firstUpdated(): void {
    this.observer = new MutationObserver(this.handleMutation);
    this.observer?.observe(this, TabGroup.observerOptions);
    setTimeout(() => this.#updateSelectionIndicator(), 100);
  }

  /**
   * If the selected tab is selected programmatically update all the tabs.
   */
  private handleMutation = (mutations: MutationRecord[]): void => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'selected' && mutation.oldValue === null) {
        const selectedTab = <Tab>mutation.target;
        this.observer?.disconnect();
        this.updateSelectedTab(selectedTab);
        this.observer?.observe(this, TabGroup.observerOptions);
      }
    });
  };

  /**
   * Apply accessible attributes and values to the tab buttons.
   */
  private setupTabs(): void {
    const tabs = this.querySelectorAll('sl-tab');

    tabs.forEach((tab, index) => {
      tab.setAttribute('id', `${this.tabGroupId}-tab-${index + 1}`);
      tab.setAttribute('aria-controls', `${this.tabGroupId}-panel-${index + 1}`);
      tab.toggleAttribute('selected', tab === this.selectedTab);
    });
  }

  /**
   * Apply accessible attributes and values to the tab panels.
   */
  private setupPanels(): void {
    const panels = this.querySelectorAll('sl-tab-panel');
    const selectedPanelId = this.selectedTab?.getAttribute('aria-controls');

    if (panels.length > 1) {
      panels.forEach((panel, index) => {
        panel.setAttribute('id', `${this.tabGroupId}-panel-${index + 1}`);
        panel.setAttribute('aria-labelledby', `${this.tabGroupId}-tab-${index + 1}`);
        panel.setAttribute('aria-hidden', `${panel.getAttribute('id') !== selectedPanelId ? 'true' : 'false'}`);
      });
    }
  }

  private handleTabChange(event: Event): void {
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not a tab or if it's already selected
     */
    if (!(event.target instanceof Tab) || event.target === this.selectedTab) return;
    this.updateSelectedTab(event.target);
  }

  /**
   * Update the selected tab button with attributes and values.
   * Update the tab group state.
   */
  private updateSelectedTab(selectedTab: Tab): void {
    if (selectedTab === this.selectedTab) return;

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const selectedPanel = this.querySelector(`#${selectedTab.getAttribute('aria-controls')}`);
    const tabIndex = Array.from(this.querySelectorAll('sl-tab')).indexOf(selectedTab);

    /**
     * Reset all the selected state of the tabs, and select the clicked tab
     */
    this.querySelectorAll('sl-tab').forEach((tab: Tab) => {
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
      panels[0].setAttribute('id', `${this.tabGroupId}-panel-${tabIndex}`);
      panels[0].setAttribute('aria-labelledby', `${this.tabGroupId}-tab-${tabIndex}`);
    } else {
      panels.forEach(panel => {
        panel.setAttribute('aria-hidden', `${panel !== selectedPanel ? 'true' : 'false'}`);
      });
    }

    this.tabChange.emit(tabIndex);

    this.#updateSelectionIndicator();
  }

  /**
   * Get the previous tab button in the tab group
   */
  private previousTab(tab: Tab): Tab {
    const tabs = Array.from(this.querySelectorAll('sl-tab'));
    const selectedTabIndex = tabs.indexOf(tab);
    return tabs[selectedTabIndex - 1];
  }
  /**
   * Handle keyboard accessible controls.
   */
  private handleKeydown(event: KeyboardEvent): void {
    const tab: Tab = <Tab>event.target;

    const firstTab = <Tab>this.querySelector('sl-tab:first-of-type');
    const lastTab = <Tab>this.querySelector('sl-tab:last-of-type');
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const nextTab = <Tab>this.querySelector(`#${tab.getAttribute('id')} ~ sl-tab`) || firstTab;
    const previousTab = this.previousTab(tab) || lastTab;

    const focusTab = (focusedTab: Tab, keyEvent: Event): void => {
      keyEvent.preventDefault();

      // Always reset the scroll when a tab is selected.
      this.scrollTo({ top: 0 });
      focusedTab.focus();
    };

    const updateTab = (selectedTab: Tab, keyEvent: Event): void => {
      keyEvent.preventDefault();

      // Always reset the scroll when a tab is selected.
      this.scrollTo({ top: 0 });
      this.updateSelectedTab(selectedTab);
    };

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        // updateTab(this.direction.isLTR ? previousTab : nextTab, event);
        focusTab(previousTab, event);
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        // updateTab(this.direction.isLTR ? nextTab : previousTab, event);
        focusTab(nextTab, event);
        break;

      case 'Home':
        focusTab(firstTab, event);
        break;

      case 'End':
        focusTab(lastTab, event);
        break;

      case 'Enter':
      case 'SpaceBar':
        updateTab(tab, event);
        break;

      default:
        break;
    }
  }

  #updateSelectionIndicator(): void {
    if (!this.selectedTab) {
      return;
    }

    const axis = this.orientation === 'vertical' ? 'Y' : 'X',
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
    indicator.style.transitionDuration = this.#shouldAnimate ? '' : '0s';

    if (axis === 'X') {
      const scrollLeft = Math.max(
        this.selectedTab.offsetLeft + this.selectedTab.offsetWidth / 2 - wrapper.clientWidth / 2,
        0
      );

      if (scrollLeft !== wrapper.scrollLeft) {
        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }

    this.#shouldAnimate = true;
  }
}
