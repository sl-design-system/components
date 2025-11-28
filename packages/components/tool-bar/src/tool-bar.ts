import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
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
  // #resizeObserver = new ResizeObserver(() => this.#onResize());

  #resizeObserver = new ResizeObserver(() => {
    clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(() => this.#onResize(), 16);
  });

  #resizeTimeout?: ReturnType<typeof setTimeout>;

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

  #totalWidth: number = 0;

  #widths: number[] = [];

  #menuButtonSize?: number;

  #menuButtonSizeCache = 44; // menu button + gap

  // #needsMeasurement = true;

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

    if (this.parentElement) {
      this.#resizeObserver.observe(this.parentElement);
    }
  }

  override disconnectedCallback(): void {
    // this.#resizeObserver.disconnect();

    // this.#resizeObserver.disconnect();
    // this.#mutationObserver.disconnect();
    //
    // super.disconnectedCallback();

    clearTimeout(this.#resizeTimeout);
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    // TODO: maybe totalwidth should be checked here? insteda of in onResize?

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

    // // const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!;
    // // const gap = parseInt(getComputedStyle(wrapper).gap) || 0;
    //
    // const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    // const gap = wrapper instanceof Element ? parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0 : 0;
    //
    // const widths = this.items.map(item => item.element.getBoundingClientRect().width);
    // this.#totalWidth = widths.reduce((sum, w, i) => sum + w + (i < widths.length - 1 ? gap : 0), 0);
  }

  override firstUpdated(): void {
    requestAnimationFrame(() => {
      // const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!;
      // const gap = parseInt(getComputedStyle(wrapper).gap) || 0;

      const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
      // const gap = wrapper instanceof Element ? parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0 : 0;

      // this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);
      // this.#totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);

      console.log('firstUpdated totalWidth:', this.#totalWidth, this.#widths);

      if (wrapper) {
        this.#measureItems(wrapper);
      }
    });
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

  #onResize(): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    if (!wrapper) {
      return;
    }

    // const availableWidth = this.getBoundingClientRect().width;
    // if (!availableWidth) {
    //   return;
    // }

    const availableWidth = this.#getAvailableWidth();
    if (!availableWidth) {
      return;
    }

    // Always temporarily show all items to get accurate measurements
    const previousVisibility = this.items.map(item => item.visible);
    this.items.forEach(item => {
      item.element.style.display = '';
    });

    // Force layout
    void wrapper.getBoundingClientRect();

    // Re-measure all items
    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;
    this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);
    this.#totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);

    // Calculate effective available width
    let effectiveAvailable = availableWidth;

    console.log('this.#menuButtonSize', this.#menuButtonSize);

    if (this.#totalWidth > availableWidth) {
      const buttonSize = this.#menuButtonSize ?? this.#menuButtonSizeCache;
      const wrapperHeight = Math.round(wrapper.getBoundingClientRect().height);

      if (this.#menuButtonSize == null && wrapperHeight > 0) {
        this.#menuButtonSizeCache = wrapperHeight + gap;
      }

      effectiveAvailable -= buttonSize + gap;
    }

    // Calculate visibility from end
    let acc = this.#totalWidth;
    for (let i = this.items.length - 1; i >= 0; i--) {
      this.items[i].visible = acc <= effectiveAvailable;
      acc -= this.#widths[i] + gap;
    }

    // Only update DOM if visibility changed
    const visibilityChanged = this.items.some((item, i) => item.visible !== previousVisibility[i]);
    console.log('visibilityChanged:', visibilityChanged);
    if (visibilityChanged) {
      this.items.forEach(item => {
        item.element.style.display = item.visible ? '' : 'none';
      });

      this.menuItems = this.items.filter(item => !item.visible);
      this.requestUpdate('items');
    }
  }

  // Robust availableWidth + precompute widths before mutating DOM
  /*  #onResize(): void {
// Force all items visible for accurate measurement
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    if (!wrapper) {
      return;
    }

    // Re-measure if needed
    if (this.#needsMeasurement || !this.#totalWidth || !this.#widths.length) {
      // Temporarily show all items for measurement
      this.items.forEach(item => {
        item.element.style.display = '';
      });

      // Force a layout
      void wrapper.getBoundingClientRect();

      this.#measureItems(wrapper);
    }

    if (!this.#totalWidth || !this.#widths.length) {
      return;
    }

    const availableWidth = this.#getAvailableWidth();
    if (!availableWidth) {
      return;
    }

    if (!this.#totalWidth || !this.#widths.length) {
      return;
    }


    // // Use element's current width to avoid inconsistent ResizeObserver entry shapes.
    // // const availableWidth = this.getBoundingClientRect().width;
    // const availableWidth = this.#getAvailableWidth(); // this.getBoundingClientRect().width;
    //
    // if (!availableWidth) {
    //   return;
    // }
    //
    // console.log('availableWidth:', availableWidth);
    //
    // // const wrapper = this.renderRoot.querySelector('[part="wrapper"]')!;
    // // const gap = parseInt(getComputedStyle(wrapper).gap) || 0;
    //
    // const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    //
    // if (!wrapper) {
    //   return;
    // }
    //
    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;

    // const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;
    // let reservedInlineEnd = 0;

    // Freeze widths so toggling display doesn't affect measurements
    // const widths = this.items.map(item => item.element.getBoundingClientRect().width);
    // const totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);

    // const widths = this.items.map(item => item.element.getBoundingClientRect().width);
    // const totalWidth = widths.reduce((sum, w, i) => sum + w + (i < widths.length - 1 ? gap : 0), 0);
    //
    // if (!totalWidth) return;

    // if (this.#needsMeasurement || !this.#totalWidth || !this.#widths.length) {
    //   this.#measureItems(wrapper);
    // }
    //
    // if (!this.#totalWidth || !this.#widths.length) return;

    // this.#widths = widths;
    // this.#totalWidth = totalWidth;

    // this.#widths = widths;
    // this.#totalWidth = totalWidth;

    console.log(
      'Math.round(totalWidth) > Math.round(availableWidth)',
      // Math.round(totalWidth) > Math.round(availableWidth),
      // Math.round(totalWidth),
     // Math.round(availableWidth),
      'widths:',
      // widths,
      'this.#totalWidth:',
      this.#totalWidth,
      'availableWidth:',
      availableWidth,
      'this.#widths:',
      this.#widths
    );

    /!*
    // Reserve space for menu button if needed
    let spaceForMenu = 0;
    if (Math.round(totalWidth) > Math.round(availableWidth)) {
      spaceForMenu = Math.round(wrapper.getBoundingClientRect().height) + gap;
    }
    const effectiveAvailable = availableWidth - spaceForMenu; // sometimes is the same as availableWidth, when menu is not visible

    console.log('effectiveAvailable:', effectiveAvailable, 'spaceForMenu:', spaceForMenu);

// Decide visibility using frozen widths (walk from end)
    this.#totalWidth = totalWidth;
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
*!/

    // Reserve space for menu button if needed
    /!*
    let spaceForMenu = 0;
    if (this.#totalWidth > availableWidth /!*Math.round(this.#totalWidth) > Math.round(availableWidth)*!/) {
      spaceForMenu = Math.round(wrapper.getBoundingClientRect().height) + gap; // 44px
    }
    const effectiveAvailable = availableWidth - spaceForMenu - gap; // sometimes is the same as availableWidth, when menu is not visible

*!/

    let spaceForMenu = 0;
    let effectiveAvailable = availableWidth;

    if (this.#totalWidth > availableWidth) {
      let buttonSize = this.#menuButtonSize ?? this.#menuButtonSizeCache;
      const wrapperHeight = Math.round(wrapper.getBoundingClientRect().height);

      if (this.#menuButtonSize == null && wrapperHeight > 0) {
        this.#menuButtonSizeCache = wrapperHeight;
        buttonSize = wrapperHeight;
      }

      spaceForMenu = buttonSize; // + gap;
      effectiveAvailable -= spaceForMenu + gap;

      // spaceForMenu = buttonSize;
      // reservedInlineEnd = spaceForMenu + gap;
      // effectiveAvailable -= reservedInlineEnd;
    }
    // const effectiveAvailable = availableWidth - spaceForMenu - gap;

    // effectiveAvailable -= spaceForMenu + gap;

    console.log(
      'effectiveAvailable:',
      effectiveAvailable,
      'spaceForMenu:',
      spaceForMenu,
      this.#totalWidth > availableWidth,
      'this.#totalWidth:',
      this.#totalWidth,
      'availableWidth:',
      availableWidth
    );

    // Decide visibility using frozen widths (walk from end)
    let acc = this.#totalWidth; //totalWidth;
    for (let i = this.items.length - 1; i >= 0; i--) {
      // const fits = acc <= effectiveAvailable; // Math.round(acc) <= Math.round(effectiveAvailable);
      // this.items[i].visible = fits;
      // acc -= this.#widths[i] + gap;
      this.items[i].visible = acc <= effectiveAvailable;
      acc -= this.#widths[i] + gap;
    }

    console.log('acc:', acc, 'gap', gap);

    // // Apply padding to the last visible item instead of the wrapper
    // let lastVisibleIndex = -1;
    // for (let i = this.items.length - 1; i >= 0; i--) {
    //   if (this.items[i].visible) {
    //     lastVisibleIndex = i;
    //     break;
    //   }
    // }

    // Apply DOM changes in one pass
    this.items.forEach(item => {
      item.element.style.display = item.visible ? '' : 'none';

      // if (item.element instanceof HTMLElement) {
      //   item.element.style.marginInlineEnd =
      //     index === lastVisibleIndex && spaceForMenu
      //       ? `${spaceForMenu + gap}px`
      //       : '';
      // }
    });

    // Reserve space in the DOM so the menu button doesn't overlap the last visible item
   // (wrapper as HTMLElement).style.paddingInlineEnd = spaceForMenu ? `${spaceForMenu}px` : '';

    this.menuItems = this.items.filter(item => !item.visible);

    this.requestUpdate('items');
  }*/

  #getAvailableWidth(): number {
    //  const hostWidth = this.getBoundingClientRect().width;
    //  const parent = this.parentElement instanceof HTMLElement ? this.parentElement : null;
    //
    //  if (!parent) {
    //    return hostWidth;
    //  }
    //
    //  const parentStyles = getComputedStyle(parent);
    //  const parentPadding =
    //    parseFloat(parentStyles.paddingLeft || '0') + parseFloat(parentStyles.paddingRight || '0');
    //  const parentWidth = parent.getBoundingClientRect().width - parentPadding;
    //
    //  console.log('hostWidth:', hostWidth, 'parentWidth:', parentWidth, 'parentPadding:', parentPadding);
    //
    //  // return hostWidth; //Math.max(parentWidth, hostWidth);
    // return Math.max(parentWidth, hostWidth);

    const hostWidth = this.getBoundingClientRect().width;
    const parent = this.parentElement instanceof HTMLElement ? this.parentElement : null;

    if (!parent) {
      return hostWidth;
    }

    const parentStyles = getComputedStyle(parent);
    const parentPadding = parseFloat(parentStyles.paddingLeft || '0') + parseFloat(parentStyles.paddingRight || '0');
    const parentWidth = parent.getBoundingClientRect().width - parentPadding;

    // Calculate space taken by siblings
    const siblings = Array.from(parent.children).filter(child => child !== this);
    const siblingsWidth = siblings.reduce((sum, sibling) => {
      return sum + sibling.getBoundingClientRect().width;
    }, 0);

    // Account for gap between flex/grid items if parent uses flex or grid
    const parentDisplay = parentStyles.display;
    let gapSpace = 0;
    // if (parentDisplay.includes('flex') || parentDisplay.includes('grid')) {
    //   const gap = parseFloat(parentStyles.gap || '0');
    //   if (gap > 0 && siblings.length > 0) {
    //     // gapSpace = gap * siblings.length;
    //     gapSpace = gap * siblings.length; // One gap per sibling (gaps between all children)
    //   }
    // }

    if (parentDisplay.includes('flex') || parentDisplay.includes('grid')) {
      const gap = parseFloat(parentStyles.gap || '0');
      if (gap > 0 && siblings.length > 0) {
        // Gap appears between each child, so total gaps = number of children - 1
        gapSpace = gap * siblings.length;
      }
    }

    const availableWidth = parentWidth - siblingsWidth - gapSpace;

    console.log(
      'hostWidth:',
      hostWidth,
      'parentWidth:',
      parentWidth,
      'siblingsWidth:',
      siblingsWidth,
      'gapSpace:',
      gapSpace,
      'availableWidth:',
      availableWidth
    );

    return Math.min(Math.max(availableWidth, 0), hostWidth);
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    console.log('slotchange event:', event);
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

    console.log('elements', elements);

    this.items = elements
      .map(element => {
        console.log('mapping element:', element, element instanceof Button, element instanceof MenuButton);

        if (element instanceof Button /*|| element instanceof ToggleButton*/) {
          return this.#mapButtonToItem(element);
        } else if (element instanceof MenuButton) {
          return this.#mapMenuButtonToItem(element);
        } /* else if (element instanceof ToggleGroup) {
          return this.#mapToggleGroupToItem(element);
        }*/ else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider' };
        } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
        }

        return undefined;
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    this.#needsMeasurement = true;
    console.log('updated items mapping:', this.items);

    // TODO: sth is wrong here... elements are not always hidden to the overflow menu in the right, proper order

    // // Reconnect the resize observer to ensure we measure the correct widths
    // this.#resizeObserver.disconnect();
    // this.#resizeObserver.observe(this);

    // // Reconnect the resize observer to ensure we measure the correct widths
    // this.#resizeObserver.disconnect();
    // this.#resizeObserver.observe(this);
    // if (this.parentElement) {
    //   this.#resizeObserver.observe(this.parentElement);
    // }
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this);
    if (this.parentElement) {
      this.#resizeObserver.observe(this.parentElement);
    }

    // Trigger immediate measurement with longer delay to ensure DOM is ready
    clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(() => this.#onResize(), 50);
  }

  #measureItems(wrapper: Element): void {
    if (this.offsetParent === null) {
      this.#needsMeasurement = true;
      return;
    }

    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;
    this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);
    this.#totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);
    this.#needsMeasurement = false;
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

    console.log('fill in mapButtonToItem:', this.type, button, label); // TODO: label not always visible, why?

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
    // let label: string | undefined =
    //   menuButton.querySelector('[slot="button"]')?.getAttribute('aria-label') ||
    //   menuButton.querySelector('[slot="button"]')?.textContent?.trim();

    let label: string | undefined =
      menuButton.renderRoot.querySelector('sl-button')?.getAttribute('aria-label') ||
      menuButton.querySelector('[slot="button"]')?.textContent?.trim();

    console.log(
      'initial label for menu button or button:',
      label,
      'element',
      menuButton,
      'button slot?',
      menuButton.querySelector('[slot="button"]'),
      menuButton.renderRoot.querySelector('sl-button'),
      'menuButton.querySelector(\'[slot="button"]\')?.textContent?.trim()',
      menuButton.querySelector('[slot="button"]')?.textContent?.trim()
    );

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

  /*  #mapToggleGroupToItem(group: ToggleGroup): ToolBarItemGroup {
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
  } // TODO: we don't need this one...*/
}
