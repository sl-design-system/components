import { faEllipsisVertical } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { ToggleGroup } from '@sl-design-system/toggle-group';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ToolBarDivider } from './tool-bar-divider.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export interface ToolBarItemBase {
  element: HTMLElement;
  visible: boolean;
}

export interface ToolBarItemButton extends ToolBarItemBase {
  type: 'button';
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  selectable?: boolean;

  click?(): void;
}

export interface ToolBarItemDivider extends ToolBarItemBase {
  type: 'divider';
}

export interface ToolBarItemGroup extends ToolBarItemBase {
  type: 'group';
  buttons: ToolBarItemButton[];
  label?: string | null;
  selects?: 'single' | 'multiple';
}

export type ToolBarItem = ToolBarItemButton | ToolBarItemDivider | ToolBarItemGroup;

// FIXME: Once the design is finalized, move this icon to the design system.
Icon.register(faEllipsisVertical);

/**
 * A responsive container that automatically hides items in an overflow menu when space is limited.
 *
 * @csspart wrapper - The wrapper element that contains the tool bar items.
 *
 * @slot - The tool bar items.
 */
@localized()
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

  // Observe changes to the size of the element.
  #observer = new ResizeObserver(() => this.#onResize());

  /** The horizontal alignment within the tool-bar. */
  @property({ reflect: true }) align?: 'start' | 'end';

  /** If true, the tool-bar is disabled and cannot be interacted with. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal True when the tool-bar is empty. */
  @property({ type: Boolean, reflect: true }) empty?: boolean;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  /**
   * If true, will cause the tool bar to not have a border; useful when embedding
   * the tool-bar inside another component.
   * FIXME: The border on this component should be removed and done by the component embedding the toolbar
   */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

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

    if (changes.has('disabled')) {
      const children = this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];

      if (this.disabled) {
        children.forEach(el => el.setAttribute('disabled', ''));
      } else {
        children.forEach(el => el.removeAttribute('disabled'));
      }
    }

    if (changes.has('items')) {
      this.menuItems = this.items.filter(item => !item.visible);
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>

      ${this.menuItems.length
        ? html`
            <sl-menu-button aria-label=${msg('Show more')}>
              <sl-icon name="far-ellipsis-vertical" slot="button"></sl-icon>
              ${this.menuItems.map(item => this.renderMenuItem(item))}
            </sl-menu-button>
          `
        : nothing}
    `;
  }

  renderMenuItem(item: ToolBarItem): TemplateResult {
    if (item.type === 'group') {
      return html`
        <sl-menu-item-group .heading=${item.label ?? ''} .selects=${item.selects}>
          ${item.buttons.map(button => this.renderMenuItem(button))}
        </sl-menu-item-group>
        <hr />
      `;
    } else if (item.type === 'divider') {
      return html`<hr />`;
    } else {
      return html`
        <sl-menu-item @click=${() => item.click?.()} ?disabled=${item.disabled} ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    }
  }

  /** FIXME: The current behavior sometimes "lags" behind; look at this again to fix that. */
  #onResize(): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]') as HTMLElement;
    const { width: availableWidth } = wrapper.getBoundingClientRect(),
      gap = parseInt(getComputedStyle(wrapper).gap);

    let totalWidth = 0;
    this.items.forEach((item, index) => {
      totalWidth += item.element.getBoundingClientRect().width;

      item.visible = Math.round(totalWidth) <= Math.round(availableWidth);
      item.element.style.visibility = item.visible ? 'visible' : 'hidden';

      if (index < this.items.length - 1) {
        totalWidth += gap;
      }
    });

    this.requestUpdate('items');
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    const elements = event.target.assignedElements({ flatten: true });

    this.empty = elements.length === 0;

    if (typeof this.disabled === 'boolean') {
      elements.forEach(el => el.toggleAttribute('disabled', this.disabled));
    }

    this.items = elements
      .map(element => {
        if (element instanceof Button || element instanceof ToggleButton) {
          return this.#mapButtonToItem(element);
        } else if (element instanceof ToggleGroup) {
          return this.#mapToggleGroupToItem(element);
        } else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider' };
        } else {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar. Only sl-button elements are allowed.`);

          return undefined;
        }
      })
      .filter(item => item !== undefined) as ToolBarItem[];
  }

  #mapToggleGroupToItem(group: HTMLElement): ToolBarItemGroup {
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
      disabled: button.hasAttribute('disabled'),
      icon: button.querySelector('sl-icon')?.getAttribute('name'),
      label: button.getAttribute('aria-label') || button.textContent?.trim(),
      selectable: button.hasAttribute('aria-pressed'),
      visible: true,
      click: () => button.click()
    };
  }
}
