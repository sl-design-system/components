import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
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
export type TabsActivation = 'auto' | 'manual';
export type TabsAlignment = 'start' | 'center' | 'end' | 'stretch';
export type TabMenuItem = {
  tab: Tab;
  disabled?: boolean;
  title: string;
  subtitle?: string;
};
declare const TabGroup_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A tab group component that can contain tabs and tab panels.
 *
 * ```html
 * <sl-tab-group>
 *   <sl-tab>First tab</sl-tab>
 *   <sl-tab selected>Second tab</sl-tab>
 *
 *   <sl-tab-panel>Content of tab 1</sl-tab-panel>
 *   <sl-tab-panel>Content of tab 2</sl-tab-panel>
 * </sl-tab-group>
 * ```
 *
 * @csspart container - The container for the tabs.
 * @csspart wrapper - Wraps the scroll container and menu button.
 * @csspart scroller - The scroll container of the tabs.
 * @csspart tablist - The tablist element which also contains the active tab indicator
 * @csspart panels - The container for the tab panels. Use this part to set the background color of all panels at once.
 *
 * @cssprop --sl-tab-group-menu-min-inline-size - The minimum inline size of the menu.
 * @cssprop --sl-tab-group-menu-max-inline-size - The maximum inline size of the menu.
 *
 * @slot default - Tab panels or other tab content here.
 * @slot tabs - The tabs to display.
 */
export declare class TabGroup extends TabGroup_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Determines when the contents of a tab is shown. Auto means the contents will be shown when the
   * tab is focused. Manual means the user has to activate the tab first by clicking or using the
   * keyboard.
   *
   * For backwards compatibility, the default is 'manual'.
   *
   * @default 'manual'
   */
  activation?: TabsActivation;
  /**
   * The alignment of tabs within the wrapper.
   *
   * @default 'start'
   */
  alignTabs?: TabsAlignment;
  /** @internal The menu items to render when the tabs are overflowing. */
  menuItems?: TabMenuItem[];
  /** @internal The currently selected tab. */
  selectedTab?: Tab;
  /** @internal Whether the menu button needs to be shown. */
  showMenu: boolean;
  /** @internal Emits when the tab has been selected/changed. */
  tabChangeEvent: EventEmitter<SlTabChangeEvent>;
  /** @internal The slotted tabs. */
  tabPanels?: TabPanel[];
  /** @internal The slotted tabs. */
  tabs?: Tab[];
  /**
   * Renders the tabs vertically instead of the default horizontal.
   *
   * @default false
   */
  vertical?: boolean;
  disconnectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
