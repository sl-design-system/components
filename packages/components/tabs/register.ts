import { TabGroup } from './src/tab-group.js';
import { TabPanel } from './src/tab-panel.js';
import { Tab } from './src/tab.js';

customElements.define('sl-tab', Tab);
customElements.define('sl-tab-group', TabGroup);
customElements.define('sl-tab-panel', TabPanel);

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-tab-change': CustomEvent<number>;
  }

  interface HTMLElementTagNameMap {
    'sl-tab': Tab;
    'sl-tab-group': TabGroup;
    'sl-tab-panel': TabPanel;
  }
}
