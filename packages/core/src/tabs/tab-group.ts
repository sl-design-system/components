import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { Tab } from './tab.js';
import styles from './tab-group.scss.js';

let tabGroupCount = 0;

export class TabGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * Unique ID for each tab group component present.
   */
  private tabGroupId = `sl-tab-group-${tabGroupCount++}`;

  /**
   * The current tab node selected in the tab group.
   */
  @state() private selectedTab: Tab | null = this.initialSelectedTab;

  /**
   * Get the selected tab button, or the first tab button.
   */
  private get initialSelectedTab(): Tab | null {
    return this.querySelector('sl-tab[selected]') || this.querySelector('sl-tab');
  }

  override render(): TemplateResult {
    return html`<div @click=${this.handleTabChange} role="tablist"><slot name="tabs"></slot></div>
      <slot></slot> `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateSlots();
  }

  private updateSlots(): void {
    this.setupTabs();
    this.setupPanels();
  }

  /**
   * Apply accessible attributes and values to the tab buttons.
   */
  private setupTabs(): void {
    const tabs = this.querySelectorAll('sl-tab');

    tabs.forEach((tab, index) => {
      tab.setAttribute('id', `${this.tabGroupId}-tab-${index + 1}`);
      tab.setAttribute('aria-controls', `${this.tabGroupId}-panel-${index + 1}`);
      tab.toggleAttribute('selected', tab === this.selectedTab);
    });
  }

  /**
   * Apply accessible attributes and values to the tab panels.
   */
  private setupPanels(): void {
    const panels = this.querySelectorAll('sl-tab-panel');
    const selectedPanelId = this.selectedTab?.getAttribute('aria-controls');

    panels.forEach((panel, index) => {
      panel.setAttribute('id', `${this.tabGroupId}-panel-${index + 1}`);
      panel.setAttribute('aria-labelledby', `${this.tabGroupId}-tab-${index + 1}`);
      panel.setAttribute('aria-hidden', `${panel.getAttribute('id') !== selectedPanelId ? 'true' : 'false'}`);
    });
  }

  private handleTabChange(event: Event): void {
    // Always reset the scroll when a tab is selected.
    this.scrollTo({ top: 0 });

    /**
     * Return handler if it's not a tab or if it's already selected
     */
    if (!(event.target instanceof Tab) || event.target === this.selectedTab) return;

    this.updateSelectedTab(event.target);
  }

  /**
   * Update the selected tab button with attributes and values.
   * Update the tab group state.
   */
  private updateSelectedTab(selectedTab: Tab): void {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const selectedPanel = this.querySelector(`#${selectedTab.getAttribute('aria-controls')}`);

    if (selectedTab === this.selectedTab) return;

    /**
     * Reset all the selected state of the tabs, and select the clicked tab
     */
    this.querySelectorAll('sl-tab').forEach(tab => {
      tab.removeAttribute('selected');
      if (tab === selectedTab) {
        tab.setAttribute('selected', '');
        // tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        this.selectedTab = tab;
      }
    });

    /**
     * Reset all the visibility of the panels,
     * and show the panel related to the selected tab
     */
    this.querySelectorAll('sl-tab-panel').forEach(panel => {
      panel.setAttribute('aria-hidden', `${panel !== selectedPanel ? 'true' : 'false'}`);
    });
  }
}
