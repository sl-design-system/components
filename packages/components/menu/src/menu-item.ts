import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Menu } from './menu.js';
import styles from './menu-item.scss.js';

Icon.register(faChevronRight);

export class MenuItem extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether this menu item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether this menu item has been selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** The sub menu, if present. */
  @state() subMenu?: Menu;

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot></slot>
        ${this.subMenu ? html`<sl-icon name="far-chevron-right"></sl-icon>` : nothing}
      </div>
      <div class="submenu">
        <slot @slotchange=${this.#onSubmenuChange} name="submenu"></slot>
      </div>
    `;
  }

  #onSubmenuChange(event: Event & { target: HTMLSlotElement }): void {
    this.subMenu = event.target.assignedNodes().find((node): node is Menu => node instanceof Menu);
  }
}
