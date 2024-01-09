import type { CSSResultGroup, TemplateResult } from 'lit';
import type { PropertyValues } from 'lit/development';
import type { EventEmitter } from '@sl-design-system/shared';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { RovingTabindexController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { faEllipsis } from '@fortawesome/pro-regular-svg-icons';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { Tab } from './tab.js';
import { TabPanel } from './tab-panel.js';
import styles from './tab-group.scss.js';

Icon.registerIcon(faEllipsis); // TODO: needs to be changed - icon from tokens

export type TabsAlignment = 'left' | 'filled';

let nextUniqueId = 0;

// TODO: add docs here like with default slots etc.

// @localized()
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

  /** The current tab node selected in the tab group. */
  @state() private selectedTabInListbox: Tab | null = this.#initialSelectedTab;

  @event() tabChange!: EventEmitter<number>;

  /** The slotted tabs. */
  #allTabs: Node[] | null = [];

  /** Renders the tabs vertically instead of the default horizontal  */
  @property({ reflect: true }) vertical = false;

  /** The alignemnt of tabs inside sl-tab-group  */
  @property({ reflect: true }) alignment: TabsAlignment = 'left';

  // private anchorDirective = new AnchorDirective();

  /** Controller for managing anchoring. */
  // #anchor: AnchorDirectiveDirective;
  // #anchor = new AnchorController(this.listbox as ReactiveController & HTMLElement); // TODO: anchor

  // /** @private */
  // @query('#more-btn') moreButton!: HTMLButtonElement;
  /** @private */
  moreButton!: HTMLButtonElement;

  /** The listbox element with all tabs list. */
  @query('[popover]') listbox!: HTMLElement;

  /** Get the selected tab button, or the first tab button. */
  get #initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab:not([disabled])');
  }

  constructor() {
    super();

    // if (this.renderRoot.querySelector('#more-btn') as HTMLButtonElement) {
    this.moreButton = this.renderRoot?.querySelector('#more-btn') as HTMLButtonElement;
    // }
    console.log('before connected - constructor', this.#allTabs, this.moreButton, this.listbox, this.renderRoot);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    console.log('changes', changes);
    this.moreButton = this.shadowRoot?.querySelector('sl-button') as HTMLButtonElement;
  }

  override render(): TemplateResult {
    // const tabs = Array.from(this.querySelectorAll('sl-tab'));
    // this.#allTabs = tabs;
    // const clonedTabs = this.tabs?.map(tab => tab.cloneNode(true)); // Clones the slotted tabs
    // TODO: no moreButton??
    // this.moreButton = this.renderRoot.querySelector('#more-btn') as HTMLButtonElement;
    this.moreButton = this.shadowRoot?.querySelector('sl-button') as HTMLButtonElement;
    // this.listbox = this.renderRoot.querySelector('[popover]') as HTMLElement;
    const clonedTabs = Array.from(this.querySelectorAll('sl-tab'))?.map(tab => tab.cloneNode(true));
    this.#allTabs = clonedTabs;
    console.log(
      'before connected - render',
      this.#allTabs,
      this.moreButton,
      this.listbox,
      this.renderRoot,
      this.shadowRoot
    );
    return html`
      <div @click=${this.#handleTabChange} role="tablist" @keydown=${this.#handleKeydown} part="tab-list">
        <span class="indicator" role="presentation"></span>
        <slot name="tabs" @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
        <sl-button
          id="more-btn"
          @click=${this.#onClick}
          popovertarget="tabs-popover"
          fill="ghost"
          variant="primary"
          size="md"
        >
          <sl-icon name="far-ellipsis"></sl-icon>
        </sl-button>
        <div
          id="tabs-popover"
          ${anchor({ element: this.moreButton, position: 'bottom-end' })}
          @toggle=${this.#onToggle}
          popover
          role="listbox"
          @click=${this.#handleTabChange}
        >
          ${this.#allTabs}
          <span class="indicator-listbox" role="presentation"></span>
        </div>
      </div>
      <slot></slot>
    `;
  } // TODO: aria-label=${msg('Close')} -> msg 'open' or 'more'
  // ${(this.#allTabs as Tab[]).map(tab => html` <span>${tab.selected} ${tab.innerHTML}</span> `)}
  // Render all tabs here and set as selected the exact one ${this.tabs?.length}

  // <slot name="all-tabs" open></slot>

  //${anchor({ element: this.moreButton, position: 'bottom-end' })}

  // @beforetoggle=${this.#onBeforetoggle}

  override connectedCallback(): void {
    super.connectedCallback();
    this.#updateSlots();
    // this.#allTabs = [...this.#rovingTabindexController.elements];
    console.log(
      'connected',
      this.tabs,
      this.#allTabs,
      this.moreButton,
      this.listbox,
      this.shadowRoot?.querySelector('sl-button') as HTMLButtonElement
    );
  }

  override firstUpdated(): void {
    // TODO: maybe morebutton here in the first updated and anchor element?
    this.#observer = new MutationObserver(this.#handleMutation);
    this.#observer?.observe(this, TabGroup.#observerOptions);
    // if (this.tabs) {
    //    this.#allTabs = this.tabs.slice();
    //  }//JSON.parse(JSON.stringify(this.#rovingTabindexController.elements)); //this.tabs; //[...this.#rovingTabindexController.elements]; // TODO: not working yet
    //  if (this.tabs) {
    //    this.#allTabs = Array.from(this.tabs);
    //  }
    // anchor({ element: this.moreButton, position: 'bottom-end'});
    // this.listbox.anchor({ element: this.moreButton, position: 'bottom-end'});
    this.#allTabs = Array.from(this.querySelectorAll('sl-tab'));
    this.listbox.classList.add('anchor');
    // this.anchorDirective.render({ element: this.moreButton, position: 'bottom-end' });
    // const tabs2 = this.querySelectorAll('sl-tab');
    // console.log('tabs2', tabs2);
    setTimeout(() => this.#updateSelectionIndicator(), 100);
    console.log('this.tabs', this.tabs, this.#allTabs);
    console.log('this.#rovingTabindexController.element', this.#rovingTabindexController.elements);
    console.log('morebutton', this.moreButton, this.shadowRoot?.querySelector('sl-button') as HTMLButtonElement);
    // const listElement = html`<div
    //   id="tabs-popover"
    //   ${anchor({ element: this.moreButton, position: 'bottom-end' })}
    //   @toggle=${this.#onToggle}
    //   popover
    //   role="listbox"
    //   @click=${this.#handleTabChange}
    // >
    //   ${this.#allTabs}
    //   <span class="indicator-listbox" role="presentation"></span>
    // </div>`;
    // this.moreButton.append(listElement);
  }

  #updateSlots(): void {
    this.#setupTabs();
    this.#setupPanels();
    // this.#updateSelectedTab(this.selectedTab as Tab);
  }

  #onClick(): void {
    // document.querySelectorAll('div[popover]').forEach(popover => {
    //   (popover as HTMLElement).togglePopover();
    // });
    const popover = this.shadowRoot?.querySelector('[popover]') as HTMLElement;
    console.log(
      'onclick',
      this,
      popover,
      isPopoverOpen(popover),
      this.listbox,
      isPopoverOpen(this.listbox),
      this.listbox.matches(':popover-open'),
      this.listbox.matches('.\\:popover-open')
    );
    // popover.togglePopover();
    // if (isPopoverOpen(this.listbox)) {
    //   // this.#setSelectedOption(this.currentOption);
    //   this.listbox.hidePopover();
    // } else {
    //   this.listbox.showPopover();
    // }
    // this.#updateSelectedTab(this.selectedTab as Tab);
    this.listbox.togglePopover();
  }

  /*  #onBeforetoggle = (event: Event): void => {
    // TODO: this method is not necessary??
    console.log('onToggle event in anchor', event, this.selectedTabInListbox, this.listbox);

    const indicatorListbox = this.shadowRoot?.querySelector('.indicator-listbox') as HTMLElement;

    if (!this.listbox || !this.selectedTab) {
      return;
    }

    this.selectedTabInListbox = this.listbox.querySelector(`#${this.selectedTab.id}`) as Tab;

    // this.selectedTabInListbox.offsetTop

    indicatorListbox.style.transform = `translateY(${this.selectedTabInListbox?.offsetTop}px) scaleY(${this.selectedTabInListbox.offsetHeight})`;

    // if (
    //   ((event as ToggleEvent).newState === 'closed' && (event.target as HTMLElement).matches(':popover-open')) ||
    //   (event as ToggleEvent).newState === (event as ToggleEvent).oldState
    // ) {
    //   event.stopPropagation();
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   (event.target as HTMLElement)?.hidePopover();
    // }

    console.log(
      'in TOGGLE this.selectedTab.offsetLeft - wrapper.offsetLeft',
      this.selectedTab?.offsetLeft,
      this.selectedTabInListbox,
      this.selectedTabInListbox?.offsetHeight,
      this.selectedTabInListbox?.offsetTop,
      this.listbox,
      this.listbox.offsetTop,
      this.listbox.offsetWidth,
      this.listbox.offsetHeight,
      this.selectedTab?.offsetParent
    );
  };*/

  // TODO: add badge and icon slot

  // TODO: on changed probably or will change set indicator, because there is a problem with indicator when switching between vertical and horizontal tabs

  #onToggle = (event: Event): void => {
    console.log('onToggle event in anchor', event, this.selectedTabInListbox, this.listbox);

    const indicatorListbox = this.shadowRoot?.querySelector('.indicator-listbox') as HTMLElement;

    if (!this.listbox || !this.selectedTab) {
      return;
    }

    // this.selectedTabInListbox = this.listbox.querySelector(`#${this.selectedTab.id}`) as Tab;

    // this.selectedTabInListbox.offsetTop

    requestAnimationFrame(() => {
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

    console.log(
      'in TOGGLE this.selectedTab.offsetLeft - wrapper.offsetLeft',
      this.selectedTab?.offsetLeft,
      this.selectedTabInListbox,
      this.selectedTabInListbox?.offsetHeight,
      this.selectedTabInListbox?.offsetTop,
      this.listbox,
      this.listbox.offsetTop,
      this.listbox.offsetWidth,
      this.listbox.offsetHeight,
      this.selectedTab?.offsetParent
    );
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
    console.log('handleTabChange', event, event.target, (event.target as HTMLElement).closest('sl-tab'));
    event.preventDefault();
    event.stopPropagation();
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not a tab or if it's already selected
     */
    if (!(event.target as HTMLElement).closest('sl-tab') /*(event.target instanceof Tab)*/) return;
    this.#updateSelectedTab((event.target as HTMLElement).closest('sl-tab') as Tab /*event.target*/);
    this.listbox.hidePopover();
  }

  /**
   * Update the selected tab button with attributes and values.
   * Update the tab group state.
   */
  #updateSelectedTab(selectedTab: Tab): void {
    console.log('updateSelectedTab', selectedTab);
    const controls = selectedTab.getAttribute('aria-controls');

    if (selectedTab === this.selectedTab || !controls || selectedTab.disabled) return;

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

    // this.selectedTabInListbox = (this.#allTabs as Tab[])?.find(tabEl => tabEl.id === selectedTab.id);

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
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.scrollTo({ top: 0 });
      this.#updateSelectedTab(<Tab>event.target);
    }
  }

  #updateSelectionIndicator(): void {
    if (!this.selectedTab || !this.selectedTabInListbox) {
      return;
    }

    const axis = this.vertical ? 'Y' : 'X',
      indicator = this.shadowRoot?.querySelector('.indicator') as HTMLElement,
      indicatorListbox = this.shadowRoot?.querySelector('.indicator-listbox') as HTMLElement,
      wrapper = this.shadowRoot?.querySelector('[role="tablist"]') as HTMLElement,
      wrapper2 = this.shadowRoot?.querySelectorAll('[slot="tabs"]');

    // let totalWidth;
    //
    // for (const tabElement of wrapper2) {
    //   totalWidth += tabElement.offsetWidth;
    // }

    let start = 0;
    if (axis === 'X') {
      start = this.selectedTab.offsetLeft - wrapper.offsetLeft;
    } else {
      start = this.selectedTab.offsetTop - wrapper.offsetTop;
    }

    console.log(
      'this.selectedTab.offsetLeft - wrapper.offsetLeft',
      axis,
      this.selectedTab.offsetLeft,
      this.selectedTabInListbox,
      this.selectedTabInListbox?.offsetHeight,
      this.listbox,
      this.listbox.offsetTop,
      wrapper.offsetLeft,
      this.selectedTab.offsetParent,
      wrapper.offsetWidth,
      wrapper.scrollWidth,
      wrapper2,
      // wrapper2.offsetWidth,
      // wrapper2.scrollWidth,
      this.#allTabs //,
      // totalWidth
    );

    // Somehow on Chromium, the offsetParent is different than on FF and Safari
    // If on Chromium, take the `wrapper.offsetLeft` into account as well
    if (this.selectedTab.offsetParent === wrapper) {
      start += axis === 'X' ? wrapper.offsetLeft : wrapper.offsetTop;
    }

    indicator.style.transform = `translate${axis}(${start}px)`;

    // scale${axis}(${
    //   axis === 'X' ? this.selectedTab.offsetWidth : this.selectedTab.offsetHeight
    // })`

    // const styleType = (axis === 'X' ? 'height' : 'width') as unknown as CSSStyleDeclaration;
    // indicator.style.styleType = `${axis === 'X' ? this.selectedTab.offsetWidth : this.selectedTab.offsetHeight}px`;

    indicatorListbox.style.transform = `translateY(${
      this.selectedTabInListbox.offsetTop + this.listbox.offsetHeight
    }px) scaleY(${this.selectedTabInListbox.offsetHeight})`;

    if (axis === 'X') {
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
      indicator.style.height = `${this.selectedTab.offsetHeight}px`;
      // TODO: restart idicator when vertical/horizontal changed, remove width or height
    }
  }
}
