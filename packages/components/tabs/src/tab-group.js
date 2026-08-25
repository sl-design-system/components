var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _idPrefix,
  _menu,
  _mutationObserver,
  _resizeObserver,
  _rovingTabindexController,
  _shouldAnimate,
  _timeoutId,
  _TabGroup_instances,
  onClick_fn,
  onFocusin_fn,
  onKeydown_fn,
  onMenuItemClick_fn,
  onScroll_fn,
  onTabSlotChange_fn,
  onTabPanelSlotChange_fn,
  linkTabsWithPanels_fn,
  scrollIntoViewIfNeeded_fn,
  scrollToTabPanelStart_fn,
  updateSelectedTab_fn,
  updateSelectionIndicator_fn,
  updateSize_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { RovingTabindexController, event, getScrollParent } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tab-group.scss.js';
import { TabPanel } from './tab-panel.js';
import { Tab } from './tab.js';
const OBSERVER_OPTIONS = {
  attributes: true,
  subtree: true,
  attributeFilter: ['selected'],
  attributeOldValue: true
};
let nextUniqueId = 0;
export let TabGroup = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _TabGroup_instances);
    /** Unique prefix ID for each component in the light DOM. */
    __privateAdd(this, _idPrefix, `sl-tab-group-${nextUniqueId++}`);
    /** Menu element, is shown when the tabs are overflowing. */
    __privateAdd(this, _menu);
    /**
     * Observe changes to the selected tab and update accordingly. This observer is necessary for
     * changes to the selected tab that are made programmatically. Selected changes made by the user
     * are handled by the click event listener.
     */
    __privateAdd(
      this,
      _mutationObserver,
      new MutationObserver(entries => {
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
        __privateGet(this, _mutationObserver)?.disconnect();
        if (selected) {
          __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(
            this,
            selected.target
          );
        } else if (deselected) {
          __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(this);
        }
        __privateGet(this, _mutationObserver)?.observe(this, OBSERVER_OPTIONS);
        __privateMethod(this, _TabGroup_instances, scrollToTabPanelStart_fn).call(this);
      })
    );
    /**
     * Observe changes to the size of the tablist so: - we can determine when to display an overflow
     * menu with tab items - we know when we need to reposition the active tab indicator
     */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(entries => {
        const hostResized = entries.some(entry => entry.target === this);
        const scrollerResized = entries.some(
          entry => entry.target instanceof HTMLElement && entry.target.matches('[part="scroller"]')
        );
        requestAnimationFrame(() => {
          __privateSet(this, _shouldAnimate, false);
          __privateMethod(this, _TabGroup_instances, updateSize_fn).call(
            this,
            hostResized,
            scrollerResized
          );
          __privateSet(this, _shouldAnimate, true);
          if (this.selectedTab) {
            __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(
              this,
              this.selectedTab,
              false
            );
          }
        });
      })
    );
    /** Manage keyboard navigation between tabs. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        elements: () => this.tabs ?? [],
        elementEnterAction: el =>
          __privateMethod(this, _TabGroup_instances, scrollIntoViewIfNeeded_fn).call(this, el),
        focusInIndex: elements => {
          const index = elements.findIndex(el => el.selected);
          return index === -1 ? 0 : index;
        },
        isFocusableElement: el => !el.disabled,
        listenerScope: () => this.renderRoot.querySelector('[part="tablist"]')
      })
    );
    /** Determines whether the active tab indicator should animate. */
    __privateAdd(this, _shouldAnimate, false);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _timeoutId);
    this.showMenu = false;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-tab': Tab,
      'sl-tab-panel': TabPanel
    };
  }
  disconnectedCallback() {
    if (__privateGet(this, _timeoutId)) {
      clearTimeout(__privateGet(this, _timeoutId));
      __privateSet(this, _timeoutId, void 0);
    }
    __privateGet(this, _resizeObserver).disconnect();
    __privateGet(this, _mutationObserver).disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    __privateGet(this, _mutationObserver).observe(this, OBSERVER_OPTIONS);
    __privateGet(this, _resizeObserver).observe(this);
    __privateSet(
      this,
      _timeoutId,
      setTimeout(() => {
        const scroller = this.renderRoot.querySelector('[part="scroller"]');
        __privateMethod(this, _TabGroup_instances, onScroll_fn).call(this, scroller);
        __privateGet(this, _resizeObserver).observe(scroller);
        __privateMethod(this, _TabGroup_instances, onScroll_fn).call(this, scroller);
        if (this.selectedTab) {
          __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(
            this,
            this.selectedTab,
            false
          );
          __privateMethod(this, _TabGroup_instances, scrollToTabPanelStart_fn).call(this);
        }
      }, 50)
    );
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('alignTabs')) {
      __privateSet(this, _shouldAnimate, false);
      __privateMethod(this, _TabGroup_instances, updateSelectionIndicator_fn).call(this);
      __privateSet(this, _shouldAnimate, true);
    }
  }
  render() {
    return html`
      <div part="container">
        <div part="wrapper">
          <div class="fade-container">
            <div class="fade fade-start"></div>
            <div class="fade fade-end"></div>
            <div
              @scroll=${event2 => __privateMethod(this, _TabGroup_instances, onScroll_fn).call(this, event2.target)}
              part="scroller">
              <div
                @click=${__privateMethod(this, _TabGroup_instances, onClick_fn)}
                @focusin=${__privateMethod(this, _TabGroup_instances, onFocusin_fn)}
                @keydown=${__privateMethod(this, _TabGroup_instances, onKeydown_fn)}
                part="tablist"
                role="tablist">
                <span class="indicator" role="presentation"></span>
                <slot
                  @slotchange=${__privateMethod(this, _TabGroup_instances, onTabSlotChange_fn)}
                  name="tabs"></slot>
              </div>
            </div>
          </div>
          ${
            this.showMenu
              ? html`
                  <sl-menu-button
                    @keydown=${__privateMethod(this, _TabGroup_instances, onKeydown_fn)}
                    aria-label=${msg('Show all', { id: 'sl.tabs.showAll' })}
                    fill="ghost">
                    <sl-icon name="ellipsis" slot="button"></sl-icon>
                    ${this.menuItems?.map(
                      menuItem => html`
                        <sl-menu-item
                          @click=${() => __privateMethod(this, _TabGroup_instances, onMenuItemClick_fn).call(this, menuItem.tab)}
                          ?disabled=${menuItem.disabled}>
                          ${menuItem.title}
                        </sl-menu-item>
                      `
                    )}
                  </sl-menu-button>
                `
              : nothing
          }
        </div>
      </div>
      <div part="panels">
        <slot
          @slotchange=${__privateMethod(this, _TabGroup_instances, onTabPanelSlotChange_fn)}></slot>
      </div>
    `;
  }
};
_idPrefix = new WeakMap();
_menu = new WeakMap();
_mutationObserver = new WeakMap();
_resizeObserver = new WeakMap();
_rovingTabindexController = new WeakMap();
_shouldAnimate = new WeakMap();
_timeoutId = new WeakMap();
_TabGroup_instances = new WeakSet();
onClick_fn = function (event2) {
  const tab = event2.target.closest('sl-tab');
  if (!tab) {
    return;
  }
  __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(this, tab);
  __privateMethod(this, _TabGroup_instances, scrollToTabPanelStart_fn).call(this);
};
onFocusin_fn = function (event2) {
  if (
    event2.target instanceof Tab &&
    this.selectedTab !== event2.target &&
    this.activation === 'auto'
  ) {
    __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(this, event2.target);
  }
};
onKeydown_fn = function (event2) {
  if (['Enter', ' '].includes(event2.key)) {
    __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(this, event2.target);
    __privateMethod(this, _TabGroup_instances, scrollToTabPanelStart_fn).call(this);
  }
};
onMenuItemClick_fn = function (tab) {
  if (tab.href) {
    tab.renderRoot.querySelector('a')?.click();
  }
  tab.click();
};
onScroll_fn = function (scroller) {
  let scrollStart = false,
    scrollEnd = false;
  if (this.vertical) {
    const { clientHeight, scrollTop, scrollHeight } = scroller,
      scrollable = scrollHeight > clientHeight;
    scrollStart = scrollable && scrollTop > 0;
    scrollEnd = scrollable && Math.round(scrollTop + clientHeight) < scrollHeight;
  } else {
    const { clientWidth, scrollLeft, scrollWidth } = scroller,
      scrollable = scrollWidth > clientWidth;
    scrollStart = scrollable && scrollLeft > 0;
    scrollEnd = scrollable && Math.round(scrollLeft + clientWidth) < scrollWidth;
  }
  this.toggleAttribute('scroll-start', scrollStart);
  this.toggleAttribute('scroll-end', scrollEnd);
  if (this.selectedTab) {
    __privateMethod(this, _TabGroup_instances, updateSelectionIndicator_fn).call(this);
  }
};
onTabSlotChange_fn = function (event2) {
  this.tabs = event2.target.assignedElements({ flatten: true }).filter(el => el instanceof Tab);
  this.tabs.forEach((tab, index) => {
    tab.id ||= `${__privateGet(this, _idPrefix)}-tab-${index + 1}`;
  });
  const selectedTab = this.tabs.find(tab => tab.selected);
  if (selectedTab) {
    __privateMethod(this, _TabGroup_instances, updateSelectedTab_fn).call(this, selectedTab, false);
    __privateMethod(this, _TabGroup_instances, scrollToTabPanelStart_fn).call(this);
  }
  __privateGet(this, _rovingTabindexController).clearElementCache();
  __privateMethod(this, _TabGroup_instances, linkTabsWithPanels_fn).call(this);
};
onTabPanelSlotChange_fn = function (event2) {
  this.tabPanels = event2.target
    .assignedElements({ flatten: true })
    .filter(el => el instanceof TabPanel);
  this.tabPanels.forEach((panel, index) => {
    panel.id ||= `${__privateGet(this, _idPrefix)}-panel-${index + 1}`;
  });
  this.toggleAttribute('no-panels', this.tabPanels.length === 0);
  __privateMethod(this, _TabGroup_instances, linkTabsWithPanels_fn).call(this);
};
linkTabsWithPanels_fn = function () {
  this.tabs?.forEach((tab, index) => {
    tab.toggleAttribute('selected', tab === this.selectedTab);
    const panel = this.tabPanels?.at(index);
    if (panel) {
      tab.setAttribute('aria-controls', `${__privateGet(this, _idPrefix)}-panel-${index + 1}`);
      panel.setAttribute('aria-hidden', tab === this.selectedTab ? 'false' : 'true');
      panel.setAttribute('aria-labelledby', `${__privateGet(this, _idPrefix)}-tab-${index + 1}`);
    } else {
      tab.removeAttribute('aria-controls');
    }
  });
};
scrollIntoViewIfNeeded_fn = function (tab, behavior) {
  const scroller = this.renderRoot.querySelector('[part="scroller"]'),
    scrollerRect = scroller.getBoundingClientRect(),
    tabRect = tab.getBoundingClientRect();
  if (this.vertical) {
    if (tabRect.top < scrollerRect.top) {
      scroller.scrollTo({
        top: scroller.scrollTop + (tabRect.top - scrollerRect.top),
        behavior
      });
    } else if (tabRect.bottom > scrollerRect.bottom) {
      scroller.scrollTo({
        top: scroller.scrollTop + (tabRect.bottom - scrollerRect.bottom),
        behavior
      });
    }
  } else {
    if (tabRect.left < scrollerRect.left) {
      scroller.scrollTo({
        left: scroller.scrollLeft + (tabRect.left - scrollerRect.left),
        behavior
      });
    } else if (tabRect.right > scrollerRect.right) {
      scroller.scrollTo({
        left: scroller.scrollLeft + (tabRect.right - scrollerRect.right),
        behavior
      });
    }
  }
};
scrollToTabPanelStart_fn = function () {
  const { bottom: containerBottom = 0 } =
      this.renderRoot.querySelector('[part="container"]')?.getBoundingClientRect() || {},
    { top: wrapperTop = 0 } =
      this.renderRoot.querySelector('[part="wrapper"]')?.getBoundingClientRect() || {},
    { top = 0 } = this.renderRoot.querySelector('[part="panels"]')?.getBoundingClientRect() || {};
  const scrollParent = getScrollParent(this);
  if (scrollParent) {
    scrollParent.scrollTo({
      top: scrollParent.scrollTop + top - (this.vertical ? wrapperTop : containerBottom)
    });
  }
};
updateSelectedTab_fn = function (selectedTab, emitEvent = true) {
  if (selectedTab !== this.selectedTab) {
    this.tabs?.forEach(tab => tab.toggleAttribute('selected', tab === selectedTab));
    this.querySelectorAll('sl-tab-panel').forEach(panel => {
      panel.setAttribute(
        'aria-hidden',
        selectedTab?.getAttribute('aria-controls') === panel.id ? 'false' : 'true'
      );
    });
    this.selectedTab = selectedTab;
    if (emitEvent) {
      this.tabChangeEvent.emit(selectedTab ? (this.tabs?.indexOf(selectedTab) ?? 0) : -1);
    }
    __privateMethod(this, _TabGroup_instances, updateSelectionIndicator_fn).call(this);
  }
  if (selectedTab) {
    __privateMethod(this, _TabGroup_instances, scrollIntoViewIfNeeded_fn).call(
      this,
      selectedTab,
      emitEvent ? 'smooth' : 'instant'
    );
    requestAnimationFrame(() => {
      __privateMethod(this, _TabGroup_instances, updateSelectionIndicator_fn).call(this);
    });
  }
};
updateSelectionIndicator_fn = function () {
  const indicator = this.renderRoot.querySelector('.indicator');
  if (!this.selectedTab) {
    indicator.style.opacity = '';
    indicator.style.transitionDuration = '0s';
    indicator.style.translate = '';
    indicator.style.inlineSize = '';
    indicator.style.blockSize = '';
    return;
  }
  let start = 0;
  const tab = this.selectedTab,
    scroller = this.renderRoot.querySelector('[part="scroller"]');
  if (!tab || !scroller) {
    return;
  }
  const firstTab = this.tabs?.[0],
    baseInline = firstTab ? firstTab.offsetLeft : 0,
    baseBlock = firstTab ? firstTab.offsetTop : 0;
  if (this.vertical) {
    start = tab.offsetTop - baseBlock;
  } else {
    start = tab.offsetLeft - baseInline;
  }
  indicator.style.opacity = '1';
  indicator.style.transitionDuration = __privateGet(this, _shouldAnimate) ? '' : '0s';
  indicator.style.transitionProperty = indicator.style.translate === '' ? 'opacity' : '';
  const sizeInline = tab.offsetWidth,
    sizeBlock = tab.offsetHeight;
  if (this.vertical) {
    indicator.style.blockSize = `${sizeBlock}px`;
    indicator.style.inlineSize = '';
    indicator.style.translate = `0 ${start}px`;
  } else {
    indicator.style.inlineSize = `${sizeInline}px`;
    indicator.style.blockSize = '';
    indicator.style.translate = `${start}px`;
  }
};
updateSize_fn = function (hostResized, tablistResized) {
  if (tablistResized) {
    const scroller = this.renderRoot.querySelector('[part="scroller"]'),
      tablist = this.renderRoot.querySelector('[part="tablist"]'),
      showingMenu = !!this.showMenu;
    this.showMenu = this.vertical
      ? tablist.scrollHeight > scroller.offsetHeight
      : tablist.scrollWidth > scroller.offsetWidth;
    if (this.showMenu) {
      const menuBtn = this.renderRoot.querySelector('sl-menu-button');
      __privateSet(this, _menu, menuBtn?.renderRoot?.querySelector('sl-menu'));
      __privateGet(this, _menu)?.addEventListener('toggle', () => {
        __privateGet(this, _rovingTabindexController).clearElementCache();
      });
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
      this.menuItems = void 0;
    }
    if (showingMenu === this.showMenu && this.selectedTab) {
      __privateMethod(this, _TabGroup_instances, scrollIntoViewIfNeeded_fn).call(
        this,
        this.selectedTab,
        'auto'
      );
    }
  } else if (hostResized && this.selectedTab) {
    __privateMethod(this, _TabGroup_instances, scrollIntoViewIfNeeded_fn).call(
      this,
      this.selectedTab,
      'auto'
    );
  }
  __privateMethod(this, _TabGroup_instances, updateSelectionIndicator_fn).call(this);
};
/** @internal */
TabGroup.styles = styles;
__decorateClass([property()], TabGroup.prototype, 'activation', 2);
__decorateClass(
  [property({ attribute: 'align-tabs', reflect: true })],
  TabGroup.prototype,
  'alignTabs',
  2
);
__decorateClass([state()], TabGroup.prototype, 'menuItems', 2);
__decorateClass([state()], TabGroup.prototype, 'selectedTab', 2);
__decorateClass([state()], TabGroup.prototype, 'showMenu', 2);
__decorateClass([event({ name: 'sl-tab-change' })], TabGroup.prototype, 'tabChangeEvent', 2);
__decorateClass([state()], TabGroup.prototype, 'tabPanels', 2);
__decorateClass([state()], TabGroup.prototype, 'tabs', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TabGroup.prototype, 'vertical', 2);
TabGroup = __decorateClass([localized()], TabGroup);
//# sourceMappingURL=tab-group.js.map
