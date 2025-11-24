import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { ToggleGroup } from '@sl-design-system/toggle-group';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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
  // fill?: ButtonFill;
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

export interface ToolBarItemMenu extends ToolBarItemBase {
  type: 'menu';
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  menuItems: Array<ToolBarItemButton | ToolBarItemDivider | ToolBarItemMenu>;
}

export type ToolBarItem = ToolBarItemButton | ToolBarItemDivider | ToolBarItemGroup | ToolBarItemMenu;

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
      'sl-menu': Menu,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-menu-item-group': MenuItemGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe changes to the child elements. */
  #mutationObserver = new MutationObserver(() => this.#updateMapping());

  /** Observe changes to the size of the element. */
  // #resizeObserver = new ResizeObserver(entries => this.#onResize(entries.at(0)?.contentBoxSize.at(0)?.inlineSize ?? 0));
  #resizeObserver = new ResizeObserver(() => this.#onResize());

  /**
   * The horizontal alignment within the tool-bar.
   * @default 'start'
   */
  @property({ reflect: true }) align?: 'start' | 'end';

  /** @internal The version of a tool-bar with spacing around. */
  @property({ type: Boolean, reflect: true }) contained?: boolean;

  /**
   * If true, the tool-bar is disabled and cannot be interacted with.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal True when the tool-bar is empty. */
  @property({ type: Boolean, reflect: true }) empty?: boolean;

  /**
   * The type of buttons and menu buttons (also overflow menu button).
   * @default 'outline'
   */
  @property() type?: Extract<ButtonFill, 'ghost' | 'outline'>;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  // /**
  //  * If true, will cause the tool bar to not have a border; useful when embedding
  //  * the tool-bar inside another component. If you set this, make sure there is enough
  //  * space around the tool bar to show focus outlines.
  //  * @default false
  //  */
  // @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** Use this if you want the menu button to use the "inverted" variant. */
  @property({ type: Boolean }) inverted?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'toolbar');

    this.#mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-disabled', 'disabled']
    });
    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

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

    // When `type` changes, update fills of assigned sl-button / sl-menu-button elements.
    if (changes.has('type')) {
      const slot = this.renderRoot.querySelector('slot');
      const assigned = slot?.assignedElements({ flatten: true }) ?? [];

      assigned.forEach(el => {
        const targets: Element[] = [];

        if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);
        targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

        targets.forEach(btn => {
          if (typeof this.type === 'string' && this.type.length) {
            btn.setAttribute('fill', this.type);
          } else {
            // btn.removeAttribute('fill');
          }
        });
      });
    }
  }

  override render(): TemplateResult {
    console.log('type in render:', this.type, this.items, this.menuItems);
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>

      ${this.menuItems.length
        ? html`
            <sl-menu-button
              aria-label=${msg('Show more', { id: 'sl.toolBar.showMore' })}
              fill=${ifDefined(this.type)}
              variant=${ifDefined(this.inverted ? 'inverted' : undefined)}
            >
              <sl-icon name="ellipsis-vertical" slot="button"></sl-icon>
              ${this.menuItems.map(item => this.renderMenuItem(item))}
            </sl-menu-button>
          `
        : nothing}
    `;
  }

  /** @internal */
  renderMenuItem(item: ToolBarItem): TemplateResult {
    if (item.type === 'group') {
      return html`
        <sl-menu-item-group .heading=${item.label ?? ''} .selects=${item.selects}>
          ${item.buttons.map(button => this.renderMenuItem(button))}
        </sl-menu-item-group>
      `;
    } else if (item.type === 'divider') {
      return html`<hr />`;
    } else if (item.type === 'button') {
      return html`
        <sl-menu-item @click=${() => item.click?.()} ?disabled=${item.disabled} ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    } else {
      return html`
        <sl-menu-item ?disabled=${item.disabled}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
          <sl-menu slot="submenu">${item.menuItems.map(menuItem => this.renderMenuItem(menuItem))}</sl-menu>
        </sl-menu-item>
      `;
    }
  }

  /**
   * Manually trigger an update of the tool-bar layout. Tool-bar tries to automatically
   * detect changes to its size and child elements, but in some cases you may need to
   * call this method manually (for example when a nested slot is present: the `slotchange`
   * event or the `MutationObserver` will not fire in the case of a nested slot).
   */
  refresh(): void {
    this.#updateMapping();
  }

  // Robust availableWidth + precompute widths before mutating DOM
  #onResize(): void {
    // const availableWidth =
    //   typeof entries === 'number'
    //     ? entries
    //     : Array.isArray(entries)
    //       ? (entries[0]?.contentBoxSize?.[0]?.inlineSize ??
    //         entries[0]?.contentRect?.width ??
    //         this.getBoundingClientRect().width)
    //       : this.getBoundingClientRect().width;

    // Use element's current width to avoid inconsistent ResizeObserver entry shapes.
    const availableWidth = this.getBoundingClientRect().width;

    if (!availableWidth) return;

    const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!;
    const gap = parseInt(getComputedStyle(wrapper).gap) || 0;

    // Freeze widths so toggling display doesn't affect measurements
    const widths = this.items.map(item => item.element.getBoundingClientRect().width);
    const totalWidth = widths.reduce((sum, w, i) => sum + w + (i < widths.length - 1 ? gap : 0), 0);

    // Reserve space for menu button if needed
    let spaceForMenu = 0;
    if (Math.round(totalWidth) > Math.round(availableWidth)) {
      spaceForMenu = Math.round(wrapper.getBoundingClientRect().height) + gap;
    }
    const effectiveAvailable = availableWidth - spaceForMenu;

    // Decide visibility using frozen widths (walk from end)
    let acc = totalWidth;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const fits = Math.round(acc) <= Math.round(effectiveAvailable);
      this.items[i].visible = fits;
      acc -= widths[i] + gap;
    }

    // Apply DOM changes in one pass
    this.items.forEach(item => {
      item.element.style.display = item.visible ? '' : 'none';
    });

    this.requestUpdate('items');
  }

  /*  #onResize(availableWidth: number): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!,
      gap = parseInt(getComputedStyle(wrapper).gap);

    // First calculate how much space we need for all the items, including gaps.
    let totalWidth = this.items.reduce((sum, item, index) => {
      return sum + item.element.getBoundingClientRect().width + (index < this.items.length - 1 ? gap : 0);
    }, 0);

    // If it doesn't fit, remove space for the menu button and its gap.
    if (Math.round(totalWidth) > Math.round(availableWidth)) {
      // The menu button has an aspect ratio of 1:1, so we can use the wrapper's height as the button width.
      availableWidth -= wrapper.getBoundingClientRect().height + gap;
    }

    // Now iterate through the items and set their visibility based on the available width.
    // this.items.toReversed().forEach(item => {
    //   item.visible = Math.round(totalWidth) <= Math.round(availableWidth);
    //   item.element.style.visibility = item.visible ? 'visible' : 'hidden';
    //   // item.element.style.display = item.visible ? 'flex' : 'none';
    //   // if (!item.visible) {
    //   //   item.element.style.display = 'none';
    //   // } else {
    //   //   item.element.style.display = '';
    //   // }
    //
    //   console.log('item visibility:', item, item.visible, totalWidth, availableWidth);
    //
    //   totalWidth -= item.element.getBoundingClientRect().width + gap;
    // });

    this.items.toReversed().forEach(item => {
      item.visible = Math.round(totalWidth) <= Math.round(availableWidth);
      item.element.style.visibility = item.visible ? 'visible' : 'hidden';
      // item.element.style.display = item.visible ? 'flex' : 'none';
      // if (!item.visible) {
      //   item.element.style.display = 'none';
      // } else {
      //   item.element.style.display = '';
      // }

      console.log('item visibility:', item, item.visible, totalWidth, availableWidth);

      totalWidth -= item.element.getBoundingClientRect().width + gap;

      // requestAnimationFrame(() => {
      //   if (!item.visible) {
      //     item.element.style.display = 'none';
      //   } else {
      //     item.element.style.display = '';
      //   }
      // });
      if (!item.visible) {
        item.element.style.display = 'none';
      } else {
        item.element.style.display = '';
      }
    });

    // this.items.toReversed();

    // this.items.reverse();


/!*    const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!,
      gap = parseInt(getComputedStyle(wrapper).gap) || 0;

    // Precompute widths so toggling `display: none` doesn't affect measurements mid-loop.
    const widths = this.items.map(item => item.element.getBoundingClientRect().width);

    // First calculate how much space we need for all the items, including gaps.
    let totalWidth = widths.reduce((sum, w, index) => {
      return sum + w + (index < widths.length - 1 ? gap : 0);
    }, 0);

    // If it doesn't fit, remove space for the menu button and its gap.
    if (Math.round(totalWidth) > Math.round(availableWidth)) {
      // The menu button has an aspect ratio of 1:1, so we can use the wrapper's height as the button width.
      availableWidth -= wrapper.getBoundingClientRect().height + gap;
    }

    // Now iterate through the items (from end) and set their visibility using `display`.
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const itemWidth = widths[i];

      item.visible = Math.round(totalWidth) <= Math.round(availableWidth);
      item.element.style.display = item.visible ? '' : 'none';

      totalWidth -= itemWidth + gap;
    }*!/

    // this.items = [...this.items].reverse();
    // this.items.forEach(item => this.appendChild(item.element));

    requestAnimationFrame(() => {
      this.requestUpdate('items');
    });
    // this.requestUpdate('items');

    // this.items = [...this.items].reverse();
    // this.items.forEach(item => this.appendChild(item.element));

    console.log('items after resize:', this.items, [...this.items].reverse());

    const hasOverflow = this.items.some(item => !item.visible);

    console.log('hasOverflow:', hasOverflow);
    //
    // if (hasOverflow) {
    //   // Reverse order so overflowed (hidden) items are moved to the end
    //   this.items = [...this.items].reverse();
    //   this.items.forEach(item => this.appendChild(item.element));
    // } else {
    //   // Keep original DOM order when nothing is overflowed
    //   this.items.forEach(item => this.appendChild(item.element));
    // }

    // this.items.reverse();
    // this.items = [...this.items].reverse();
  } */ // TODO: maybe display: none instead of visibility hidden and no flex: 1 on the wrapper?

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    // Ignore events from nested slots.
    if (event.target !== this.renderRoot.querySelector('slot')) {
      return;
    }

    const assigned = event.target.assignedElements({ flatten: true });

    if (typeof this.disabled === 'boolean') {
      event.target.assignedElements({ flatten: true }).forEach(el => el.toggleAttribute('disabled', this.disabled));
    }

    // TODO: set for each sl-button inside the slot the fill to this.type

    // // set for each sl-button inside the slot the fill to this.type
    // assigned.forEach(el => {
    //   // include direct sl-button elements and any nested sl-button elements
    //   const buttons: Element[] = [];
    //   if (el.tagName === 'SL-BUTTON') buttons.push(el);
    //   buttons.push(...Array.from(el.querySelectorAll('sl-button')));
    //
    //   buttons.forEach(btn => {
    //     if (typeof this.type === 'string' && this.type.length) {
    //       btn.setAttribute('fill', this.type);
    //     } else {
    //       btn.removeAttribute('fill');
    //     }
    //   });
    // });

    // set for each sl-button and sl-menu-button inside the slot the fill to this.type
    assigned.forEach(el => {
      const targets: Element[] = [];

      // include direct sl-button and sl-menu-button elements
      if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);

      // include any nested sl-button and sl-menu-button elements
      targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

      console.log('setting fill for targets:', targets);

      targets.forEach(btn => {
        if (this.type) {
          btn.setAttribute('fill', this.type);
        } /*else {
          btn.removeAttribute('fill');
        }*/
      });
    });

    this.#updateMapping();
  }

  #updateMapping(): void {
    const slot = this.renderRoot.querySelector('slot')!,
      elements = slot.assignedElements({ flatten: true });

    this.empty = elements.length === 0;

    this.items = elements
      .map(element => {
        if (element instanceof Button || element instanceof ToggleButton) {
          return this.#mapButtonToItem(element);
        } else if (element instanceof MenuButton) {
          return this.#mapMenuButtonToItem(element);
        } else if (element instanceof ToggleGroup) {
          return this.#mapToggleGroupToItem(element);
        } else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider' };
        } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
        }

        return undefined;
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    console.log('updated items mapping:', this.items);

    // Reconnect the resize observer to ensure we measure the correct widths
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this);
  }

  #mapButtonToItem(button: HTMLElement): ToolBarItemButton {
    let label: string | undefined = button.getAttribute('aria-label') || button.textContent?.trim();

    if (button.hasAttribute('aria-labelledby')) {
      const buttonLabelledby = button.getAttribute('aria-labelledby');

      if (this.querySelector(`#${buttonLabelledby}`)) {
        label = this.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
      } else if (
        button.nextElementSibling &&
        button.nextElementSibling.tagName === 'SL-TOOLTIP' &&
        buttonLabelledby === button.nextElementSibling.id
      ) {
        label = button.nextElementSibling.textContent?.trim();
      }
    } else if (!label && button.hasAttribute('aria-describedby')) {
      label = this.querySelector(`#${button.getAttribute('aria-describedby')}`)?.textContent?.trim();
    }

    console.log('fill in mapButtonToItem:', this.type, button, label);

    return {
      element: button,
      type: 'button',
      disabled: button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true',
      // fill: button.getAttribute('aria-disabled') as ButtonFill | undefined, // this.type,
      icon: button.querySelector('sl-icon')?.getAttribute('name'),
      label,
      selectable: button.hasAttribute('aria-pressed'),
      visible: true,
      click: () => button.click()
    };
  }

  #mapMenuButtonToItem(menuButton: MenuButton): ToolBarItemMenu {
    let label: string | undefined =
      menuButton.getAttribute('aria-label') || menuButton.querySelector('[slot="button"]')?.textContent?.trim();

    if (menuButton.hasAttribute('aria-labelledby')) {
      const buttonLabelledby = menuButton.getAttribute('aria-labelledby');

      if (this.querySelector(`#${buttonLabelledby}`)) {
        label = this.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
      } else if (
        menuButton.nextElementSibling &&
        menuButton.nextElementSibling.tagName === 'SL-TOOLTIP' &&
        buttonLabelledby === menuButton.nextElementSibling.id
      ) {
        label = menuButton.nextElementSibling.textContent?.trim();
      }
    } else if (!label && menuButton.hasAttribute('aria-describedby')) {
      label = this.querySelector(`#${menuButton.getAttribute('aria-describedby')}`)?.textContent?.trim();
    }

    console.log('label for menu button or button:', label, 'element', menuButton);

    const menuItems = Array.from(menuButton.querySelectorAll('sl-menu-item')).map(el => this.#mapButtonToItem(el));

    return {
      element: menuButton,
      type: 'menu',
      disabled: menuButton.hasAttribute('disabled') || menuButton.getAttribute('aria-disabled') === 'true',
      icon: menuButton.querySelector('sl-icon')?.getAttribute('name'),
      label,
      menuItems,
      visible: true
    };
  }

  #mapToggleGroupToItem(group: ToggleGroup): ToolBarItemGroup {
    return {
      element: group,
      type: 'group',
      label: group.getAttribute('aria-label'),
      buttons: Array.from(group.children)
        .filter(el => !(el instanceof Tooltip))
        .map(button => this.#mapButtonToItem(button as HTMLElement)),
      selects: group.multiple ? 'multiple' : 'single',
      visible: true
    };
  }
}
