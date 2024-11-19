import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem } from '@sl-design-system/menu';
import {
  type EventEmitter,
  RovingTabindexController,
  event,
  getScrollParent,
  isPopoverOpen
} from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './tab-group.scss.js';
import { TabPanel } from './tab-panel.js';
import { Tab } from './tab.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-tab-change': SlTabChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-tab-group': TabGroup;
  }
}

export type SlTabChangeEvent = CustomEvent<number>;

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
 *     <sl-tab>First tab</sl-tab>
 *     <sl-tab selected>Second tab</sl-tab>
 *
 *     <sl-tab-panel>Content of tab 1</sl-tab-panel>
 *     <sl-tab-panel>Content of tab 2</sl-tab-panel>
 *   </sl-tab-group>
 * ```
 *
 * @csspart container - The container for the tabs.
 * @csspart wrapper - Wraps the scroll container and menu button.
 * @csspart scroller - The scroll container of the tabs.
 * @csspart tablist - The tablist element which also contains the active tab indicator
 * @csspart panels - The container for the tab panels.
 *
 * @cssprop --sl-tab-group-menu-min-inline-size - The minimum inline size of the menu.
 * @cssprop --sl-tab-group-menu-max-inline-size - The maximum inline size of the menu.
 *
 * @slot default - Tab panels or other tab content here.
 * @slot tabs - The tabs to display.
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

  // #events = new EventsController(this);

  /** Unique prefix ID for each component in the light DOM. */
  #idPrefix = `sl-tab-group-${nextUniqueId++}`;

  /**
   * Observe changes to the selected tab and update accordingly. This observer
   * is necessary for changes to the selected tab that are made programmatically.
   * Selected changes made by the user are handled by the click event listener.
   */
  #mutationObserver = new MutationObserver(entries => {
    const selected = entries.find(
      entry =>
        entry.attributeName === 'selected' &&
        entry.oldValue === null &&
        entry.target instanceof Tab &&
        entry.target.parentElement === this
    );

    const deselected = entries.find(
      entry =>
        entry.attributeName === 'selected' &&
        entry.target instanceof Tab &&
        entry.target.parentElement === this &&
        !entry.target.hasAttribute('selected')
    );

    // Update the selected tab with the observer turned off to avoid loops
    this.#mutationObserver?.disconnect();

    if (selected) {
      this.#updateSelectedTab(selected.target as Tab);
    } else if (deselected) {
      this.#updateSelectedTab();
    }

    this.#mutationObserver?.observe(this, OBSERVER_OPTIONS);
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
    // focusInIndex: ((elements: Tab[]) => elements.findIndex(el => el.selected) )|| 0,
    focusInIndex: (elements: Tab[]) => {
      const index = elements.findIndex(el => el.selected);
      return index === -1 ? 0 : index;
    },
    // focusInIndex: (elements: Tab[]) => elements.findIndex(el => el.selected),
    // focusInIndex: (elements: Tab[]) => elements.findIndex(el => el.selected) ?? 0,
    //  elements: () => (this.menuItems ? this.menuItems?.map(item => {return item.tab}) : this.tabs )|| [],
    elements: () =>
      (isPopoverOpen(this.#menu)
        ? this.menuItems?.map(item => {
            return item.tab;
          })
        : this.tabs) || [],
    // elements: () => (isPopoverOpen(this.renderRoot.querySelector('sl-menu-button')!.renderRoot.querySelector('sl-menu')!) ? this.menuItems : this.tabs) || [],
    isFocusableElement: (el: Tab) => !el.disabled
  });

  /** Determines whether the active tab indicator should animate. */
  #shouldAnimate = false;

  /** The alignment of tabs within the wrapper. */
  @property({ attribute: 'align-tabs', reflect: true }) alignTabs?: TabsAlignment;

  /** @internal The menu items to render when the tabs are overflowing. */
  @state() menuItems?: Array<{ tab: Tab; disabled?: boolean; title: string; subtitle?: string }>;

  /** @internal The currently selected tab. */
  @state() selectedTab?: Tab;

  /** @internal Whether the menu button needs to be shown. */
  @state() showMenu = false;

  /** @internal Emits when the tab has been selected/changed. */
  @event({ name: 'sl-tab-change' }) tabChangeEvent!: EventEmitter<SlTabChangeEvent>;

  /** @internal The slotted tabs. */
  @state() tabPanels?: TabPanel[];

  /** @internal The slotted tabs. */
  @state() tabs?: Tab[];

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ type: Boolean, reflect: true }) vertical?: boolean;

  /** The listbox element with all tabs list. */
  @query('[popover]') listbox!: HTMLElement;

  #menu: Menu | undefined;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#mutationObserver.observe(this, OBSERVER_OPTIONS);

    // We need to wait for the next frame so the element has time to render
    requestAnimationFrame(() => {
      const tablist = this.renderRoot.querySelector('[part="tablist"]') as Element;

      // We want to observe the size of the tablist, not the
      // container or wrapper. The tablist is the element that
      // changes size for example when fonts are loaded. The
      // other elements do not change size while the tablist does.
      this.#resizeObserver.observe(tablist);

      //  this.#events.listen(this, 'keydown', this.#onKeydown);
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

    // In vertical mode, we need to observe the scroller for changes in size to
    // determine when we need to show the menu button.
    if (changes.has('vertical')) {
      const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement;

      if (this.vertical) {
        this.#resizeObserver.observe(scroller);
      } else {
        this.#resizeObserver.unobserve(scroller);
      }
    }
  }

  // TODO: role tablist should be added to the different place?
  // TODO: role tablist to slot???

  override render(): TemplateResult {
    console.log(
      'rovingTabindexController',
      this.#rovingTabindexController,
      this.#rovingTabindexController.focusInIndex,
      this.selectedTab
    );
    return html`
      <div part="container">
        <div part="wrapper">
          <div class="fade-container">
            <div class="fade fade-start"></div>
            <div class="fade fade-end"></div>
            <div @scroll=${this.#onScroll} part="scroller">
              <div @click=${this.#onClick} @keydown=${this.#onKeydown} part="tablist" role="tablist">
                <span class="indicator" role="presentation"></span>
                <slot @slotchange=${this.#onTabSlotChange} name="tabs"></slot>
              </div>
            </div>
          </div>
          ${this.showMenu
            ? html`
                <sl-menu-button aria-label=${msg('Show all')} fill="ghost">
                  <sl-icon name="ellipsis" slot="button"></sl-icon>
                  ${this.menuItems?.map(
                    menuItem => html`
                      <sl-menu-item @click=${() => this.#onMenuItemClick(menuItem.tab)} ?disabled=${menuItem.disabled}>
                        ${menuItem.title}
                      </sl-menu-item>
                    `
                  )}
                </sl-menu-button>
              `
            : nothing}
        </div>
      </div>
      <div part="panels">
        <slot @slotchange=${this.#onTabPanelSlotChange}></slot>
      </div>
    `;
  } // TODO: menu button aria label not working with NVDA...

  // override focus(): void {
  //   this.#rovingTabindexController.focus();
  // }

  #onClick(event: Event & { target: HTMLElement }): void {
    const tab = event.target.closest('sl-tab');

    if (!tab) {
      return;
    }

    this.#updateSelectedTab(tab);
    this.#scrollToTabPanelStart();
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    console.log(
      'listbox',
      this.listbox,
      this.renderRoot.querySelector('sl-menu-button'),
      this.renderRoot,
      this.showMenu
    );

    const menuBtn = this.renderRoot.querySelector('sl-menu-button'),
      menu = menuBtn?.renderRoot.querySelector('sl-menu');

    console.log('menus', menuBtn, menu, isPopoverOpen(menu!), '......', this.#menu && isPopoverOpen(this.#menu));

    if (this.#menu && isPopoverOpen(this.#menu)) {
      this.#rovingTabindexController.clearElementCache();
      this.#rovingTabindexController.hostContainsFocus();
    }

    // const tab = event.target.closest('sl-tab');
    //
    console.log('keydown, tab', event, event.target /*, tab*/, this.menuItems);

    console.log('keydown activeElement', event.key, document.activeElement);

    if (/*tab &&*/ ['Enter', ' '].includes(event.key)) {
      // this.#updateSelectedTab(tab);
      this.#updateSelectedTab(<Tab>event.target);
      this.#scrollToTabPanelStart();
    }
  }

  #onMenuItemClick(tab: Tab): void {
    this.#updateSelectedTab(tab);
  }

  #onScroll(event: Event & { target: HTMLElement }): void {
    let scrollStart = false,
      scrollEnd = false;

    if (this.vertical) {
      const { clientHeight, scrollTop, scrollHeight } = event.target,
        scrollable = scrollHeight > clientHeight;

      scrollStart = scrollable && scrollTop > 0;
      scrollEnd = scrollable && Math.round(scrollTop + clientHeight) < scrollHeight;
    } else {
      const { clientWidth, scrollLeft, scrollWidth } = event.target,
        scrollable = scrollWidth > clientWidth;

      scrollStart = scrollable && scrollLeft > 0;
      scrollEnd = scrollable && Math.round(scrollLeft + clientWidth) < scrollWidth;
    }

    this.toggleAttribute('scroll-start', scrollStart);
    this.toggleAttribute('scroll-end', scrollEnd);
  }

  #onTabSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.tabs = event.target.assignedElements({ flatten: true }).filter((el): el is Tab => el instanceof Tab);
    this.tabs.forEach((tab, index) => {
      tab.id ||= `${this.#idPrefix}-tab-${index + 1}`;
    });

    this.selectedTab = this.tabs.find(tab => tab.selected);

    if (!this.selectedTab) {
      console.log('no selected', this.selectedTab, this.tabs[0]);
      this.tabs[0].setAttribute('tabindex', '0');
    }

    console.log('selected??', this.selectedTab, this.tabs[0]);

    this.#rovingTabindexController.clearElementCache();
    this.#linkTabsWithPanels();
  }

  #onTabPanelSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.tabPanels = event.target
      .assignedElements({ flatten: true })
      .filter((el): el is TabPanel => el instanceof TabPanel);

    this.tabPanels.forEach((panel, index) => {
      panel.id ||= `${this.#idPrefix}-panel-${index + 1}`;
    });

    // Set the no-panels attribute if there are no panels; used for styling
    this.toggleAttribute('no-panels', this.tabPanels.length === 0);

    this.#linkTabsWithPanels();
  }

  #linkTabsWithPanels(): void {
    this.tabs?.forEach((tab, index) => {
      tab.toggleAttribute('selected', tab === this.selectedTab);

      const panel = this.tabPanels?.at(index);

      if (panel) {
        tab.setAttribute('aria-controls', `${this.#idPrefix}-panel-${index + 1}`);
        panel.setAttribute('aria-hidden', tab === this.selectedTab ? 'false' : 'true');
        panel.setAttribute('aria-labelledby', `${this.#idPrefix}-tab-${index + 1}`);
      } else {
        tab.removeAttribute('aria-controls');
      }
    });
  }

  #scrollIntoViewIfNeeded(tab: Tab): void {
    const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement,
      scrollerRect = scroller.getBoundingClientRect(),
      tabRect = tab.getBoundingClientRect();

    if (this.vertical) {
      if (tabRect.top < scrollerRect.top) {
        // The tab is above the top edge of the scroller
        scroller.scrollBy({ top: tabRect.top - scrollerRect.top });
      } else if (tabRect.bottom > scrollerRect.bottom) {
        // The tab is below the bottom edge of the scroller
        scroller.scrollBy({ top: tabRect.bottom - scrollerRect.bottom });
      }
    } else {
      if (tabRect.left < scrollerRect.left) {
        // The tab is to the left of the left edge of the scroller
        scroller.scrollBy({ left: tabRect.left - scrollerRect.left });
      } else if (tabRect.right > scrollerRect.right) {
        // The tab is to the right of the right edge of the scroller
        scroller.scrollBy({ left: tabRect.right - scrollerRect.right });
      }
    }
  }

  #scrollToTabPanelStart(): void {
    const { bottom: containerBottom = 0 } =
        this.renderRoot.querySelector('[part="container"]')?.getBoundingClientRect() || {},
      { top: wrapperTop = 0 } = this.renderRoot.querySelector('[part="wrapper"]')?.getBoundingClientRect() || {},
      { top = 0 } = this.renderRoot.querySelector('[part="panels"]')?.getBoundingClientRect() || {};

    // Scroll to make sure the top of the panel is visible, but don't scroll too far
    // so the tab container/wrapper may become unstuck.
    getScrollParent(this)?.scrollBy({ top: top - (this.vertical ? wrapperTop : containerBottom) });
  }

  #updateSelectedTab(selectedTab?: Tab): void {
    if (selectedTab !== this.selectedTab) {
      this.tabs?.forEach(tab => tab.toggleAttribute('selected', tab === selectedTab));

      this.querySelectorAll('sl-tab-panel').forEach(panel => {
        panel.setAttribute('aria-hidden', selectedTab?.getAttribute('aria-controls') === panel.id ? 'false' : 'true');
      });

      this.selectedTab = selectedTab;
      this.tabChangeEvent.emit(selectedTab ? (this.tabs?.indexOf(selectedTab) ?? 0) : -1);
      this.#updateSelectionIndicator();
    }

    if (selectedTab) {
      this.#scrollIntoViewIfNeeded(selectedTab);
    }
  }

  #updateSelectionIndicator(): void {
    const indicator = this.renderRoot.querySelector('.indicator') as HTMLElement;

    if (!this.selectedTab) {
      indicator.style.opacity = '';
      indicator.style.scale = '';
      indicator.style.transitionDuration = '0s';
      indicator.style.translate = '';

      return;
    }

    const tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement,
      rect = this.selectedTab.getBoundingClientRect();

    let start = 0;
    if (this.vertical) {
      start = rect.top - tablist.getBoundingClientRect().top;
    } else {
      start = rect.left - tablist.getBoundingClientRect().left;
    }

    indicator.style.opacity = '1';
    indicator.style.transitionDuration = this.#shouldAnimate ? '' : '0s';
    indicator.style.transitionProperty = indicator.style.translate === '' ? 'opacity' : '';

    if (this.vertical) {
      indicator.style.scale = `1 ${rect.height / 100}`;
      indicator.style.translate = `0 ${start}px`;
    } else {
      indicator.style.scale = `${rect.width / 100} 1`;
      indicator.style.translate = `${start}px`;
    }
  }

  #updateSize(): void {
    const scroller = this.renderRoot.querySelector('[part="scroller"]') as HTMLElement,
      tablist = this.renderRoot.querySelector('[part="tablist"]') as HTMLElement;

    this.showMenu = this.vertical
      ? tablist.scrollHeight > scroller.offsetHeight
      : tablist.scrollWidth > scroller.offsetWidth;

    // const menuBtn = this.renderRoot.querySelector('sl-menu-button');
    //
    //   this.menu = menuBtn?.renderRoot.querySelector('sl-menu');

    if (this.showMenu) {
      const menuBtn = this.renderRoot.querySelector('sl-menu-button');

      this.#menu = menuBtn!.renderRoot.querySelector('sl-menu') as Menu;

      this.#rovingTabindexController.clearElementCache();

      this.menuItems = this.tabs?.map(tab => {
        const title = Array.from(tab.childNodes)
          .filter(node => node instanceof Text || (node instanceof Element && !node.slot))
          .reduce((acc, node) => acc + node.textContent?.trim() || '', '');

        const subtitle = Array.from(tab.childNodes)
          .filter(node => node instanceof Element && node.slot === 'subtitle')
          .reduce((acc, node) => acc + node.textContent?.trim() || '', '');

        return { tab, disabled: tab.disabled, title, subtitle };
      });
    } else {
      this.menuItems = undefined;
    }

    this.selectedTab?.scrollIntoView(false);

    this.#updateSelectionIndicator();
  }
}
