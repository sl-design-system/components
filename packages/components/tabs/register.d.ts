import { Tab } from './src/tab.js';
import { TabGroup } from './src/tab-group.js';
import { TabPanel } from './src/tab-panel.js';
declare global {
    interface HTMLElementTagNameMap {
        'sl-tab': Tab;
        'sl-tab-group': TabGroup;
        'sl-tab-panel': TabPanel;
    }
}
