import { Tab } from './src/tab.js';
import { TabGroup } from './src/tab-group.js';
import { TabListbox } from './src/tab-listbox.js';
import { TabPanel } from './src/tab-panel.js';

customElements.define('sl-tab', Tab);
customElements.define('sl-tab-group', TabGroup);
customElements.define('sl-tab-listbox', TabListbox);
customElements.define('sl-tab-panel', TabPanel);

declare global {
  interface HTMLElementTagNameMap {
    'sl-tab': Tab;
    'sl-tab-group': TabGroup;
    'sl-tab-listbox': TabListbox;
    'sl-tab-panel': TabPanel;
  }
}
