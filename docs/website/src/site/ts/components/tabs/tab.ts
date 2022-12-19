import type { PropertyValues, TemplateResult } from 'lit';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
// import styles from './tab.scss.js';

/** We will generate unique id's for the tabs. */
let nextUniqueId = 0;

export class Tab extends LitElement {
  /** @private */
  // static styles: CSSResultGroup = styles;

  static override styles = css`
    :host {
      display: block;
      opacity: 0;
      outline: none;
      pointer-events: none;
    }

    :host([selected]) {
      opacity: 1;
      pointer-events: all;
    }
  `;

  /** Whether this tab is active. */
  @property({ type: Boolean, reflect: true }) selected = false;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.slot = 'tab';
    this.tabIndex = 0;
    this.setAttribute('role', 'tabpanel');

    if (!this.hasAttribute('id')) {
      this.id = `dna-tab-${nextUniqueId++}`;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('selected')) {
      if (this.selected) {
        this.setAttribute('aria-expanded', 'true');
        this.setAttribute('tabindex', '0');
      } else {
        this.removeAttribute('aria-expanded');
        this.setAttribute('tabindex', '-1');
      }
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
