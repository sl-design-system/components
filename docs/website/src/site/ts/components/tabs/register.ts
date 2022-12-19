// import '../icon/register.js';
import { Tab } from './tab.js';
import { TabBar } from './tab-bar.js';
import { TabButton } from './tab-button.js';
import { Tabs } from './tabs.js';

customElements.define('dna-tab', Tab);
customElements.define('dna-tabs', Tabs);
customElements.define('dna-tab-bar', TabBar);
customElements.define('dna-tab-button', TabButton);

declare global {
  interface HTMLElementTagNameMap {
    'dna-tab': Tab;
    'dna-tabs': Tabs;
    'dna-tab-bar': TabBar;
    'dna-tab-button': TabButton;
  }
}
