import type { TabBarSelectedEvent } from './tab-bar.js';
import { TabButton } from './tab-button.js';
import { TabBar } from './tab-bar.js';
import { Tabs } from './tabs.js';
import { Tab } from './tab.js';

customElements.define('sl-tab', Tab);
customElements.define('sl-tabs', Tabs);
customElements.define('sl-tab-bar', TabBar);
customElements.define('sl-tab-button', TabButton);

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-tab-bar-selected': TabBarSelectedEvent<number>;
  }
  interface HTMLElementTagNameMap {
    'sl-tab': Tab;
    'sl-tabs': Tabs;
    'sl-tab-bar': TabBar;
    'sl-tab-button': TabButton;
  }
}
