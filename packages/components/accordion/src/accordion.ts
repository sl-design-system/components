import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
// import { EventsController } from '@sl-design-system/shared';
import type { AccordionItem } from './accordion-item.js';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './accordion.scss.js';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonFill = 'solid' | 'outline' | 'link' | 'ghost';

export type ButtonType = 'button' | 'reset' | 'submit';

export type ButtonVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * An accordion component....
 *
 * ```html
 *   <sl-accordionn>...</sl-accordion>
 * ```
 *
 * @slot default - Text label of the button. Optionally an <code>sl-icon</code> can be added
 */
export class Accordion extends LitElement {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Event controller. */
  // #events = new EventsController(this, {
  //   click: this.#onClick,
  //   keydown: this.#onKeydown
  // });

  /** The original tabIndex before disabled. */
  private originalTabIndex = 0;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean; // will we need disabled element here?

  /**
   * The fill of the button.
   */
  @property({ reflect: true }) fill: ButtonFill = 'solid';

  /**
   * The size of the button.
   */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /**
   * The type of the button. Can be used to mimic the functionality of submit and reset buttons in native HTML buttons.
   */
  @property() type: ButtonType = 'button';

  /**
   * The variant of the button.
   */
  @property({ reflect: true }) variant: ButtonVariant = 'default';

  // @property() summary!: string; // TODO: only text in the summary? if not add a slot for summary and then this text inside

  // TODO: add property summary and open attribute

  // /** The slotted accordion items. */
  // @queryAssignedElements({ slot: 'items' }) items?: AccordionItem[];

  /** @private The slotted accordion items. */
  @queryAssignedElements() items!: AccordionItem[];

  override connectedCallback(): void {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.tabIndex = 0;
    // }
  }

  /** @private */
  formDisabledCallback(disabled: boolean): void {
    if (disabled) {
      this.originalTabIndex = this.tabIndex;
    }

    this.tabIndex = disabled ? -1 : this.originalTabIndex;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // if (changes.has('size')) {
    //   this.#setIconProperties(Array.from(this.childNodes));
    // }
  }

  override render(): TemplateResult {
    console.log('items', this.items);

    return html` <div class="wrapper">
      <slot></slot>
    </div>`;
  } // <slot @slotchange=${this.#onSlotChange}></slot>
  // TODO: onclick on details needed?

  /*<details>
<summary>${this.summary}</summary>
<div class="panel">
  <slot @slotchange=${this.#onSlotChange}></slot>
</div>
</details>*/

  /*<details>
<summary>${this.summary}</summary>
<div class="panel">
  <slot @slotchange=${this.#onSlotChange}></slot>
</div>
</details>*/

  // #onClick(/*event: Event*/): void {
  //   // if (this.hasAttribute('disabled')) {
  //   //   event.preventDefault();
  //   //   event.stopPropagation();
  //   // } else if (this.type === 'reset') {
  //   //   this.internals.form?.reset();
  //   // } else if (this.type === 'submit') {
  //   //   this.internals.form?.requestSubmit();
  //   // }
  // }

  // #onKeydown(event: KeyboardEvent): void {
  //   if (event.key === 'Enter' || event.key === ' ') {
  //     this.click();
  //
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }

  // #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
  //   // const assignedNodes = event.target.assignedNodes({ flatten: true });
  //   // this.#setIconProperties(assignedNodes);
  // }

  #hasOnlyIconAsChild(el: HTMLElement): boolean {
    return (
      (el.textContent || '').trim().length === 0 && el.children.length === 1 && el.children[0].nodeName === 'SL-ICON'
    );
  }

  // #setIconProperties(assignedNodes: Node[]): void {
  //   const filteredNodes = assignedNodes.filter(node => {
  //     return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
  //   });
  //
  //   let hasIcon = false;
  //
  //   filteredNodes.forEach(node => {
  //     const el = node as HTMLElement;
  //     if (el.nodeName === 'SL-ICON') {
  //       el.setAttribute('size', this.size);
  //     } else if (this.#hasOnlyIconAsChild(el)) {
  //       (el.children[0] as HTMLElement).setAttribute('size', this.size);
  //     }
  //   });
  //
  //   if (filteredNodes.length === 1) {
  //     const el = filteredNodes[0] as HTMLElement;
  //     // This button is icon-only if it only contains an icon.
  //     hasIcon = el.nodeName === 'SL-ICON' || this.#hasOnlyIconAsChild(el);
  //   }
  //
  //   this.toggleAttribute('icon-only', hasIcon);
  // }
}
