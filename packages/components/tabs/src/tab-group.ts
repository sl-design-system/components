import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tab-group.scss.js';
import { TabPanel } from './tab-panel.js';
import { Tab } from './tab.js';

export type TabsAlignment = 'start' | 'center' | 'end' | 'stretch';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  subtree: true,
  attributeFilter: ['selected'],
  attributeOldValue: true
};

let nextUniqueId = 0;

/**
 * A tab group component that can contain tabs and tab panels.
 *
 * ```html
 *   <sl-tab-group>
 *     <sl-tab selected>First tab</sl-tab>
 *     <sl-tab>Second tab</sl-tab>
 *
 *     <sl-tab-panel>Content of the tab 1</sl-tab-panel>
 *     <sl-tab-panel>Content of the tab 2</sl-tab-panel>
 *   </sl-tab-group>
 * ```
 *
 * @slot default - a place for the tab group content.
 */
@localized()
export class TabGroup extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-tab': Tab,
      'sl-tab-panel': TabPanel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Unique prefix ID for each component in the light DOM. */
  #idPrefix = `sl-tab-group-${nextUniqueId++}`;

  /**
   * Observe changes to the selected tab and update accordingly. This observer
   * is necessary for changes to the selected tab that are made programmatically.
   * Selected changes made by the user are handled by the click event listener.
   */
  #mutationObserver = new MutationObserver(entries => {
    entries.forEach(entry => {
      if (entry.attributeName === 'selected' && entry.oldValue === null) {
        this.#mutationObserver?.disconnect();

        // Update the selected tab with the observer turned off to avoid loops
        this.#updateSelectedTab(entry.target as Tab);

        this.#mutationObserver?.observe(this, OBSERVER_OPTIONS);
      }
    });
  });

  /**
   * Observe changes to the size of the tablist so:
   * - we can determine when to display an overflow menu with tab items
   * - we know when we need to reposition the active tab indicator
   */
  #resizeObserver = new ResizeObserver(() => {
    this.#shouldAnimate = false;
    this.#updateSize();
    this.#shouldAnimate = true;
  });

  /** Manage keyboard navigation between tabs. */
  #rovingTabindexController = new RovingTabindexController<Tab>(this, {
    focusInIndex: (elements: Tab[]) => elements.findIndex(el => el.selected),
    elements: () => this.tabs || [],
    isFocusableElement: (el: Tab) => !el.disabled
  });

  /** Determines whether the active tab indicator should animate. */
  #shouldAnimate = false;

  /** The alignment of tabs within the wrapper. */
  @property({ reflect: true, attribute: 'align-tabs' }) alignTabs?: TabsAlignment;

  /** The currently selected tab. */
  @state() selectedTab?: Tab;

  /** Whether the menu button needs to be shown. */
  @state() showMenu = false;

  /** Emits when the tab has been selected/changed. */
  @event({ name: 'sl-tab-change' }) tabChangeEvent!: EventEmitter<number>;

  /** The slotted tabs. */
  @state() tabs?: Tab[];

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#mutationObserver.observe(this, OBSERVER_OPTIONS);

    // We need to wait for the next frame so the element has time to render
    requestAnimationFrame(() => {
      const tablist = this.renderRoot.querySelector('[part="tablist"]') as Element;

      // We want to observe the size of the tablist, not the
      // container or wrapper. The tablist is the element that
      // changes size for example when fonts are loaded. The
      // other elements do not change size when the tablist does.
      this.#resizeObserver.observe(tablist);
    });
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('alignTabs')) {
      this.#shouldAnimate = false;
      this.#updateSelectionIndicator();
      this.#shouldAnimate = true;
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="container">
        <div part="wrapper">
          <div part="scroller">
            <div @click=${this.#onClick} @keydown=${this.#onKeydown} part="tablist" role="tablist">
              <span class="indicator" role="presentation"></span>
              <slot @slotchange=${this.#onSlotchange} name="tabs"></slot>
            </div>
          </div>

          ${this.showMenu
            ? html`
                <sl-menu-button aria-label=${msg('Show all')} fill="ghost">
                  <sl-icon name="ellipsis" slot="button"></sl-icon>
                  ${this.tabs?.map(
                    tab => html`
                      <sl-menu-item @click=${() => this.#onMenuItemClick(tab)} ?disabled=${tab.disabled}>
                        ${tab.textContent?.trim()}
                      </sl-menu-item>
                    `
                  )}
                </sl-menu-button>
              `
            : nothing}
        </div>
      </div>
      <slot @slotchange=${() => this.#linkTabsWithPanels()}></slot>
    `;
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    const tab = event.target.closest('sl-tab');

    if (!tab) {
      return;
    }

    this.scrollTo({ top: 0 });
    this.#updateSelectedTab(tab);
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    const tab = event.target.closest('sl-tab');

    if (tab && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.scrollTo({ top: 0 });
      this.#updateSelectedTab(tab);
    }
  }

  #onMenuItemClick(tab: Tab): void {
    this.#updateSelectedTab(tab);
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.tabs = event.target.assignedElements({ flatten: true }).filter((el): el is Tab => el instanceof Tab);
    this.selectedTab = this.tabs.find(tab => tab.selected) || this.tabs.find(tab => !tab.disabled);

    this.#rovingTabindexController.clearElementCache();
    this.#linkTabsWithPanels();
  }

  #linkTabsWithPanels(): void {
    this.tabs?.forEach((tab, index) => {
      tab.setAttribute('id', `${this.#idPrefix}-tab-${index + 1}`);
      tab.setAttribute('aria-controls', `${this.#idPrefix}-panel-${index + 1}`);
      tab.toggleAttribute('selected', tab === this.selectedTab);
    });

    const panels = this.querySelectorAll('sl-tab-panel'),
      selectedPanelId = this.selectedTab?.getAttribute('aria-controls'),
      selectedTabIndex = this.selectedTab ? this.tabs?.indexOf(this.selectedTab) ?? 0 : 0;

    if (panels.length === 1) {
      panels[0].setAttribute('id', `${this.#idPrefix}-panel-${selectedTabIndex + 1}`);
      panels[0].setAttribute('aria-labelledby', `${this.#idPrefix}-tab-${selectedTabIndex + 1}`);
      panels[0].setAttribute('aria-hidden', 'false');
    } else {
      panels.forEach((panel, index) => {
        panel.setAttribute('id', `${this.#idPrefix}-panel-${index + 1}`);
        panel.setAttribute('aria-labelledby', `${this.#idPrefix}-tab-${index + 1}`);
        panel.setAttribute('aria-hidden', `${panel.getAttribute('id') !== selectedPanelId ? 'true' : 'false'}`);
      });
    }
  }

  #updateSelectedTab(selectedTab: Tab): void {
    if (selectedTab === this.selectedTab) {
      return;
    }

    this.tabs?.forEach(tab => tab.toggleAttribute('selected', tab === selectedTab));

    this.querySelectorAll('sl-tab-panel').forEach(panel => {
      panel.setAttribute('aria-hidden', selectedTab.getAttribute('aria-controls') === panel.id ? 'false' : 'true');
    });

    this.selectedTab = selectedTab;
    this.selectedTab.scrollIntoView(this.vertical ? { block: 'nearest' } : { inline: 'nearest' });

    this.tabChangeEvent.emit(this.tabs?.indexOf(selectedTab) ?? 0);

    this.#updateSelectionIndicator();
  }

  #updateSelectionIndicator(): void {
    if (!this.selectedTab) {
      return;
    }

    const indicator = this.renderRoot.querySelector('.indicator') as HTMLElement,
      tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement,
      rect = this.selectedTab.getBoundingClientRect();

    let start = 0;
    if (this.vertical) {
      start = rect.top - tablist.getBoundingClientRect().top;
    } else {
      start = rect.left - tablist.getBoundingClientRect().left;
    }

    indicator.style.transitionDuration = this.#shouldAnimate ? '' : '0s';

    if (this.vertical) {
      indicator.style.scale = `1 ${rect.height}`;
      indicator.style.translate = `0 ${start}px`;
    } else {
      indicator.style.scale = `${rect.width} 1`;
      indicator.style.translate = `${start}px`;
    }
  }

  #updateSize(): void {
    const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement,
      tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement;

    this.showMenu = !this.vertical && tablist.offsetWidth >= scroller.offsetWidth;

    this.selectedTab?.scrollIntoView();

    this.#updateSelectionIndicator();
  }
}
