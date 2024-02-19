import { faCheck, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Menu } from './menu.js';
import styles from './menu-item.scss.js';

Icon.register(faCheck, faChevronRight);

export class MenuItem extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this, {
    click: this.#onClick
  });

  /** Emits when the user toggles the selected state. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<boolean>;

  /** Whether this menu item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether this menu item has been selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** Whether this menu item can be selected. */
  @property({ type: Boolean, reflect: true }) selectable?: boolean;

  /** The sub menu, if present. */
  @state() subMenu?: Menu;

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        ${this.selected ? html`<sl-icon name="far-check"></sl-icon>` : nothing}
        <slot></slot>
        ${this.subMenu ? html`<sl-icon name="far-chevron-right"></sl-icon>` : nothing}
      </div>
      <div class="submenu">
        <slot @slotchange=${this.#onSubmenuChange} name="submenu"></slot>
      </div>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    if (this.selectable) {
      this.selected = !this.selected;
      this.selectEvent.emit(this.selected);
    }
  }

  #onSubmenuChange(event: Event & { target: HTMLSlotElement }): void {
    this.subMenu = event.target.assignedNodes().find((node): node is Menu => node instanceof Menu);
  }
}
