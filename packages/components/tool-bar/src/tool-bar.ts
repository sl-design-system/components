import { faEllipsisVertical } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonGroup } from '@sl-design-system/button-group';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ToolBarDivider } from './tool-bar-divider.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export type ToolBarItem = ToolBarItemButton | ToolBarItemDivider | ToolBarItemGroup;

export interface ToolBarItemButton {
  element: HTMLElement;
  type: 'button';
  icon?: string | null;
  label?: string | null;
  selectable?: boolean;
  visible: boolean;

  click?(): void;
}

export interface ToolBarItemDivider {
  element: HTMLElement;
  type: 'divider';
  visible: boolean;
}

export interface ToolBarItemGroup {
  element: HTMLElement;
  type: 'group';
  buttons: ToolBarItemButton[];
  label?: string | null;
  selects?: 'single' | 'multiple';
  visible: boolean;
}

Icon.register(faEllipsisVertical);

/**
 * A responsive container that automatically hides items in an overflow menu when space is limited.
 *
 * @slot - The tool bar items.
 */
export class ToolBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-menu-item-group': MenuItemGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // Observer changes to the size of the element.
  #observer = new ResizeObserver(() => this.#onResize());

  /** If true, the tool-bar is disabled and cannot be interacted with. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'toolbar');

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('items')) {
      this.menuItems = this.items.filter(item => !item.visible);
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>

      <sl-menu-button style=${styleMap({ visibility: this.menuItems.length ? '' : 'hidden' })}>
        <sl-icon name="far-ellipsis-vertical" slot="button"></sl-icon>
        ${this.menuItems.map(item => this.renderMenuItem(item))}
      </sl-menu-button>
    `;
  }

  renderMenuItem(item: ToolBarItem): TemplateResult {
    if (item.type === 'group') {
      return html`
        <sl-menu-item-group .heading=${item.label} .selects=${item.selects}>
          ${item.buttons.map(button => this.renderMenuItem(button))}
        </sl-menu-item-group>
        <hr />
      `;
    } else if (item.type === 'divider') {
      return html`<hr />`;
    } else {
      return html`
        <sl-menu-item @click=${() => item.click?.()} ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    }
  }

  #onResize(): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]') as HTMLElement;
    const { width: availableWidth } = wrapper.getBoundingClientRect(),
      gap = parseInt(getComputedStyle(wrapper).gap);

    let totalWidth = 0;
    this.items.forEach(item => {
      totalWidth += item.element.getBoundingClientRect().width;

      item.visible = totalWidth <= availableWidth;
      item.element.style.visibility = item.visible ? 'visible' : 'hidden';

      totalWidth += gap;
    });

    this.requestUpdate('items');
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    const elements = event.target.assignedElements({ flatten: true });

    this.items = elements
      .map(element => {
        if (element instanceof Button || element instanceof ToggleButton) {
          return this.#mapButtonToItem(element);
        } else if (element instanceof ButtonGroup) {
          return this.#mapButtonGroupToItem(element);
        } else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider' };
        } else {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar. Only sl-button elements are allowed.`);

          return undefined;
        }
      })
      .filter(item => item !== undefined) as ToolBarItem[];
  }

  #mapButtonGroupToItem(group: HTMLElement): ToolBarItemGroup {
    return {
      element: group,
      type: 'group',
      label: group.getAttribute('aria-label'),
      buttons: Array.from(group.children).map(button => this.#mapButtonToItem(button as HTMLElement)),
      selects: 'multiple',
      visible: true
    };
  }

  #mapButtonToItem(button: HTMLElement): ToolBarItemButton {
    return {
      element: button,
      type: 'button',
      icon: button.querySelector('sl-icon')?.getAttribute('name'),
      label: button.getAttribute('aria-label') || button.textContent?.trim(),
      selectable: button.hasAttribute('aria-pressed'),
      visible: true,
      click: () => button.click()
    };
  }
}
